package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strings"
	"sync"

	"encoding/json"
)

var (
	waitGroup sync.WaitGroup
)

func httpGet(url string) (data []byte, statusCode int) {
	res, err1 := http.Get(url)
	// fmt.Println(resp)
	if err1 != nil {
		statusCode = -100
		fmt.Println(err1)
		return
	}
	defer res.Body.Close()
	data, err2 := ioutil.ReadAll(res.Body)
	// data, err2 := iconv.NewReader(res.Body, "gb2312", "utf-8")
	if err2 != nil {
		statusCode = -200
		return
	}
	statusCode = res.StatusCode
	return
}

func downloadImg(img string, folder string) {
	defer waitGroup.Done()
	dir := "images/" + folder + "/"
	fmt.Println(img)
	pos := strings.LastIndex(img, "/")
	sign := strings.LastIndex(img, "?")
	var end int
	if sign > pos {
		end = sign
	} else {
		end = len(img)
	}
	filename := string(img[pos+1 : end])
	file, err := os.Create(dir + "/" + filename)
	fmt.Println(filename)
	defer file.Close()
	if err != nil {
		fmt.Println("error for create file")
		fmt.Println(err)
	}
	data, error := httpGet(img)
	if error != 200 {
		fmt.Println("error for download image:", error)
		fmt.Println("download again: ", img)
		waitGroup.Add(1)
		go downloadImg(img, folder)
	}
	file.Write(data)
}

func pathExists(path string) (bool, error) {
	_, err := os.Stat(path)
	if err == nil {
		return true, nil
	}
	if os.IsNotExist(err) {
		return false, nil
	}
	return false, err
}

type SingleAlbum struct {
	Album  string   `json:"album"`
	Photos []string `json:"photos"`
}
type AllAlbum struct {
	//字段必须大写, 如果小写的话,其他包是读取不到
	Page   string        `json:"page"`
	Albums []SingleAlbum `json:"albums"`
}

func readfilejson(fileName string) (AllAlbum, error) {
	filePath := "./source/" + fileName
	file, err := os.OpenFile(filePath, os.O_RDONLY, 0664)
	if err != nil {
		fmt.Printf("file failed err %v", err)
	}
	defer file.Close()
	data, err := ioutil.ReadAll(file)
	if err != nil {
		fmt.Printf("read failed err %v", err)
	}
	var album AllAlbum
	err = json.Unmarshal(data, &album)
	if err != nil {
		fmt.Printf("JSON unmarshal failed err %v\n", err)
	}
	// fmt.Printf("album:%#v\n", album)
	return album, err
}

func main() {
	fmt.Println("image downloader")
	// a, _ := readfilejson(name + ".json")
	// albums := a.Albums
	// var urls []string
	// for _, v := range albums {
	// 	photos := v.Photos
	// 	// fmt.Printf("album:%#v\n", v.Photos)
	// 	for _, e := range photos {
	// 		urls = append(urls, e)
	// 	}
	// }

	// fmt.Println(len(urls))
	// /* use goroutine */
	// ch := make(chan struct{}, 30)
	// for _, e := range urls {
	// 	go func(e string) {
	// 		waitGroup.Add(1)
	// 		go downloadImg(e, name)
	// 		ch <- struct{}{}
	// 	}(e)
	// }
	// for range urls {
	// 	<-ch
	// }

	// waitGroup.Wait()
}
