package com.btec.game_caro_api.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "orders")
public class Order {

    @Id
    private String id;
    private List<Product> listProduct;
    private List<String> productIds;
    private BigDecimal totalPrice;
    private LocalDateTime createdDate;
    private String status;
    private String note;

    // Constructors
    public Order() {}

    public Order(String id, List<Product> listProduct, List<String> productIds, BigDecimal totalPrice, LocalDateTime createdDate, String status, String note) {
        this.id = id;
        this.listProduct = listProduct;
        this.productIds = productIds;
        this.totalPrice = totalPrice;
        this.createdDate = createdDate;
        this.status = status;
        this.note = note;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public List<Product> getListProduct() {
        return listProduct;
    }

    public void setListProduct(List<Product> listProduct) {
        this.listProduct = listProduct;
    }

    public List<String> getProductIds() {
        return productIds;
    }

    public void setProductIds(List<String> productIds) {
        this.productIds = productIds;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}

