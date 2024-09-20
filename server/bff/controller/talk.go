package controller

import (
	"encoding/json"
	"fmt"
	"net/http"

	"com.doran.bff/model"
	"com.doran.bff/service"
)

// Post /api/v1/bff/talk/response
func SendController(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// get role aand situation from query
	role := r.URL.Query().Get("role")
	situation := r.URL.Query().Get("situation")

	// get messages from form field and parse it to json
	messages := r.FormValue("messages")
	var messagesJson json.RawMessage
	if err := json.Unmarshal([]byte(messages), &messagesJson); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	// get userMessage from form field and parse it to json
	userMessage := r.FormValue("userMessage")
	var userMessageJson json.RawMessage
	if err := json.Unmarshal([]byte(userMessage), &userMessageJson); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	// get voice. content-type: audio/wav, key: voice, value: audio file
	voice, header, err := r.FormFile("voice")
	if err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		fmt.Println(header.Header.Get("Content-Type"))
		return
	}
	defer voice.Close()

	sendRes, err := service.SendService(messagesJson, userMessageJson, role, situation)
	if err != nil || sendRes.StatusCode != http.StatusOK {
		http.Error(w, "Error calling SendService", http.StatusInternalServerError)
		return
	}
	defer sendRes.Body.Close()

	pronunciationRes, err := service.PronunciationService(voice)
	if err != nil || pronunciationRes.StatusCode != http.StatusOK {
		http.Error(w, "Error calling PronunciationService", http.StatusInternalServerError)
		return
	}
	defer pronunciationRes.Body.Close()

	var sendResBody model.TutorSendResponse
	if err := json.NewDecoder(sendRes.Body).Decode(&sendResBody); err != nil {
		http.Error(w, "Error parsing SendService response", http.StatusInternalServerError)
		return
	}

	fmt.Println(sendResBody)

	// get pronunciation from pronunciationRes's body
	var pronunciationResBody model.TutorPronunciationResponse
	if err := json.NewDecoder(pronunciationRes.Body).Decode(&pronunciationResBody); err != nil {
		http.Error(w, "Error parsing PronunciationService response", http.StatusInternalServerError)
		return
	}

	fmt.Println(pronunciationResBody)

	// make response
	response := model.TutorCombinedResponse{
		Data: model.TutorCombinedResponseData{
			Correctness:   sendResBody.Data.Correctness,
			Pronunciation: pronunciationResBody.Data,
			TutorResponse: sendResBody.Data.TutorResponse,
			IsOver:        sendResBody.Data.IsOver,
		},
		Message: sendResBody.Message,
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, "Error encoding response", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
