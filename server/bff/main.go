package main

import (
	"log"
	"net/http"

	"com.doran.bff/controller"
)

func main() {
	http.HandleFunc("/api/v1/bff/validate", controller.Validate)
	http.HandleFunc("/api/v1/bff/regist", controller.Regist)
	http.HandleFunc("/api/v1/bff/login", controller.Login)

	http.HandleFunc("/api/v1/bff/talk/send", controller.SendController)
	http.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	log.Println("BFF Server started at :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
