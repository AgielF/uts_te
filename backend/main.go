package main

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// --- MODELS ---

type User struct {
	ID       uint   `gorm:"primaryKey" json:"id"`
	Username string `gorm:"unique" json:"username"`
	Password string `json:"-"`    // Tidak dikirim ke frontend
	Role     string `json:"role"` // Vendor, Supplier, Reseller
}

type Product struct {
	ID         uint    `gorm:"primaryKey" json:"id"`
	Name       string  `json:"name"`
	BasePrice  float64 `json:"base_price"`
	SupplierID uint    `json:"supplier_id"`
}

type Contract struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	VendorID     uint      `json:"vendor_id"`   // Pemilik Sistem
	SupplierID   uint      `json:"supplier_id"` // Penyedia Barang
	ResellerID   uint      `json:"reseller_id"` // Penjual Retail
	ProductID    uint      `json:"product_id"`
	Qty          int       `json:"qty"`
	PriceAgreed  float64   `json:"price_agreed"`
	PaymentType  string    `json:"payment_type"`  // "Cash" atau "TOP" (Term of Payment)
	TOPDays      int       `json:"top_days"`      // Jatuh tempo (misal 30 hari)
	ReturnPolicy bool      `json:"return_policy"` // Bisa retur jika tidak laku?
	CreatedAt    time.Time `json:"created_at"`
}

type Sale struct {
	ID            uint      `gorm:"primaryKey" json:"id"`
	Total         float64   `json:"total"`
	PaymentMethod string    `json:"payment_method"` // Cash, Debit, QRIS
	DetailPay     string    `json:"detail_pay"`     // No.Kartu atau Ref QRIS
	CreatedAt     time.Time `json:"created_at"`
}

var DB *gorm.DB

func main() {
	// Koneksi DB
	dsn := "root:@tcp(127.0.0.1:3306)/db_supply_pos?charset=utf8mb4&parseTime=True&loc=Local"
	var err error
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("Gagal koneksi database")
	}

	// Migrasi Tabel
	DB.AutoMigrate(&User{}, &Product{}, &Contract{}, &Sale{})

	r := gin.Default()
	r.Use(cors.Default())

	// --- AUTH ROUTES ---
	r.POST("/register", Register)
	r.POST("/login", Login)

	// --- B2B & CONTRACT ROUTES ---
	r.POST("/contracts", CreateContract) // Vendor membuat kesepakatan
	r.GET("/contracts", GetContracts)
	r.GET("/products", GetProducts)

	// --- POS ROUTES ---
	r.POST("/checkout", CheckoutPOS)

	r.Run(":8080")
}

// --- HANDLERS ---

func Register(c *gin.Context) {
	var input struct {
		Username string `json:"username"`
		Password string `json:"password"`
		Role     string `json:"role"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"error": "Input salah"})
		return
	}
	hashed, _ := bcrypt.GenerateFromPassword([]byte(input.Password), 8)
	user := User{Username: input.Username, Password: string(hashed), Role: input.Role}
	DB.Create(&user)
	c.JSON(200, gin.H{"message": "Berhasil daftar"})
}

func Login(c *gin.Context) {
	var input User
	var user User
	c.ShouldBindJSON(&input)
	if err := DB.Where("username = ?", input.Username).First(&user).Error; err != nil {
		c.JSON(401, gin.H{"error": "User tidak ditemukan"})
		return
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
		c.JSON(401, gin.H{"error": "Password salah"})
		return
	}
	c.JSON(200, gin.H{"role": user.Role, "username": user.Username})
}

func CreateContract(c *gin.Context) {
	var con Contract
	if err := c.ShouldBindJSON(&con); err == nil {
		con.CreatedAt = time.Now()
		DB.Create(&con)
		c.JSON(200, con)
	}
}

func GetContracts(c *gin.Context) {
	var cons []Contract
	DB.Find(&cons)
	c.JSON(200, cons)
}

func GetProducts(c *gin.Context) {
	var p []Product
	DB.Find(&p)
	c.JSON(200, p)
}

func CheckoutPOS(c *gin.Context) {
	var s Sale
	if err := c.ShouldBindJSON(&s); err == nil {
		s.CreatedAt = time.Now()
		DB.Create(&s)
		c.JSON(200, gin.H{"status": "success", "receipt": s})
	}
}
