package com.btec.game_caro_api.services;

import com.btec.game_caro_api.entities.Order;
import com.btec.game_caro_api.entities.Product;
import com.btec.game_caro_api.repositories.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Optional<Order> getOrderById(String id) {
        return orderRepository.findById(id);
    }

    public Order saveOrder(Order order) {
        return orderRepository.save(order);

//        List<Product> products = productReposetory.findAllById(order.getProductIds());
//        order.setListProduct(products);
//
//        double totalPrice = products.stream().mapToDouble(Product::getPrice).sum();
//        order.setTotalPrice(totalPrice);
//
//        order.setCreatedDate(new Date());
//        return orderRepository.save(order);
    }

    public void deleteOrder(String id) {
        orderRepository.deleteById(id);
    }

//    /**
//     * Fetches orders created between startDate and endDate (inclusive).
//     * The dates are in yyyyMMdd format.
//     *
//     * @param startDate Start date in yyyyMMdd format as Long
//     * @param endDate   End date in yyyyMMdd format as Long
//     * @return List of Orders in the specified date range
//     */
//    public List<Order> getOrderFromDateToDateyyyyMMdd(Long startDate, Long endDate) {
//        // Convert yyyyMMdd Long to LocalDate
//        LocalDate startLocalDate = LocalDate.of(
//                Math.toIntExact(startDate / 10000),
//                Math.toIntExact((startDate % 10000) / 100),
//                Math.toIntExact(startDate % 100)
//        );
//        LocalDate endLocalDate = LocalDate.of(
//                Math.toIntExact(endDate / 10000),
//                Math.toIntExact((endDate % 10000) / 100),
//                Math.toIntExact(endDate % 100)
//        );
//
//        // Convert LocalDate to Instant (at start and end of the day)
//        Instant startInstant = startLocalDate.atStartOfDay(ZoneId.systemDefault()).toInstant();
//        Instant endInstant = endLocalDate.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();
//
//        // Fetch orders and filter by date range
//        return orderRepository.findAll()
//                .stream()
//                .filter(order -> {
//                    LocalDateTime orderCreatedDate = order.getCreatedDate();
//                    Instant orderInstant = orderCreatedDate.atZone(ZoneId.systemDefault()).toInstant();
//                    return orderInstant.isAfter(startInstant.minusMillis(1)) &&
//                            orderInstant.isBefore(endInstant);
//                })
//                .collect(Collectors.toList());
//    }
}

