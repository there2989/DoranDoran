package service

import (
	"fmt"
	"io"
	"net/http"
	"strings"
)

var (
	UserUrl = "http://user.ns-user.svc.cluster.local:8080"
)

// GET userUrl/api/v1/user/duplication?email="example@naver.com"
func DuplicationService(email string) (*http.Response, error) {
	req, err := http.NewRequest(http.MethodGet, UserUrl+"/api/v1/user/duplication?email="+email, nil)
	if err != nil {
		return nil, err
	}

	return http.DefaultClient.Do(req)
}

// GET /api/v1/user/my-page/user/{userId}
func GetUserService(userId string) (*http.Response, error) {
	req, err := http.NewRequest(http.MethodGet, UserUrl+"/api/v1/user/my-page/user/"+userId, nil)
	if err != nil {
		return nil, err
	}

	return http.DefaultClient.Do(req)
}

// GET /api/v1/user/find
func GetUserNameByUserIDService(userIds []int) (*http.Response, error) {
	req, err := http.NewRequest(http.MethodGet, UserUrl+"/api/v1/user/find", nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")

	requestBody := fmt.Sprintf("[%s]", strings.Trim(strings.Replace(fmt.Sprint(userIds), " ", ",", -1), "[]"))
	req.Body = io.NopCloser(strings.NewReader(requestBody))

	return http.DefaultClient.Do(req)
}

// PATCH /api/v1/user/my-page/birthday
func UpdateBirthdayService(userId string, birthday string) (*http.Response, error) {
	req, err := http.NewRequest(http.MethodPatch, UserUrl+"/api/v1/user/my-page/birthday", nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")
	body := fmt.Sprintf(`{"userId":%s,"birthday":"%s"}`, userId, birthday)
	req.Body = io.NopCloser(strings.NewReader(body))

	return http.DefaultClient.Do(req)
}

// PATCH /api/v1/user/my-page/nickname
func UpdateNicknameService(userId string, nickname string) (*http.Response, error) {
	req, err := http.NewRequest(http.MethodPatch, UserUrl+"/api/v1/user/my-page/nickname", nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")
	body := fmt.Sprintf(`{"userId":%s,"nickname":"%s"}`, userId, nickname)
	req.Body = io.NopCloser(strings.NewReader(body))

	return http.DefaultClient.Do(req)
}

// PATCH /api/v1/bff/my-page/password
func UpdatePasswordService(userId, prevPassword, modPassword string) (*http.Response, error) {
	req, err := http.NewRequest(http.MethodPatch, UserUrl+"/api/v1/user/my-page/password", nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")
	body := fmt.Sprintf(`{"userId":%s,"prevPassword":"%s","modPassword":"%s"}`, userId, prevPassword, modPassword)
	req.Body = io.NopCloser(strings.NewReader(body))

	return http.DefaultClient.Do(req)
}

// Delete /api/v1/user/delete/{userId}
func DeleteUserService(userId string) (*http.Response, error) {
	req, err := http.NewRequest(http.MethodDelete, UserUrl+"/api/v1/user/delete/"+userId, nil)
	if err != nil {
		return nil, err
	}

	return http.DefaultClient.Do(req)
}

// PATCH /api/v1/user/item/buy
func BuyItemService(userId, itemType, itemId string) (*http.Response, error) {
	req, err := http.NewRequest(http.MethodPatch, UserUrl+"/api/v1/user/item/buy", nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")
	body := fmt.Sprintf(`{"userId":%s,"itemType":"%s","itemId":"%s"}`, userId, itemType, itemId)
	req.Body = io.NopCloser(strings.NewReader(body))

	return http.DefaultClient.Do(req)
}
