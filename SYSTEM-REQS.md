### Package Tracking System Requirements

#### 1. **Introduction**

This system aims to provide a simple and efficient solution for business owners who sell products through social media platforms such as Facebook or Instagram to manage the delivery process. The system will allow users to track packages handed over to delivery couriers, facilitating communication and delivery scheduling with customers.

#### 2. **User Roles**

- **Business Owners**: Sellers who use social media platforms to sell their products.
- **Couriers**: Delivery agents responsible for picking up, delivering packages, and updating delivery status.
- **Customers**: End-users receiving the packages.

#### 3. **Functional Requirements**

##### 3.1 **Business Owner Functions**

- **Order Creation**: Business owners can create a new order by providing the customer’s details, product details, and delivery address.
- **Package Handover**: Business owners can record when a package is handed over to the courier, including the delivery fee and customer’s address.
- **Track Package**: Business owners can track the package’s status in real-time until it reaches the customer.
- **Order History**: View a history of all orders with their delivery statuses and details.

##### 3.2 **Courier Functions**

- **Order Assignment**: Couriers are assigned packages from business owners.
- **Customer Communication**: Couriers can communicate with customers to confirm delivery time and location.
- **Update Delivery Status**: Couriers can update the status of each package (e.g., picked up, in transit, delivered).
- **Delivery Fee Collection**: Couriers can mark the delivery fee as received when handing over the package.

##### 3.3 **Customer Functions**

- **Receive Notifications**: Customers are notified via SMS or email when their package is picked up and when it is out for delivery.
- **Track Package**: Customers can track the status of their package through a link or tracking ID.
- **Communicate with Courier**: Customers can contact the courier to schedule or reschedule delivery.

#### 4. **Non-Functional Requirements**

##### 4.1 **Usability**

- **User-friendly Interface**: The system should have a simple and intuitive interface for business owners, couriers, and customers.
  
##### 4.2 **Performance**

- **Real-time Updates**: The system should provide real-time package tracking and status updates.

##### 4.3 **Scalability**

- **Support for Multiple Users**: The system should be able to handle a growing number of business owners, couriers, and customers simultaneously without performance degradation.

##### 4.4 **Security**

- **Secure Data Handling**: All sensitive data, such as customer addresses and business owner information, should be encrypted and securely handled.
- **Authentication and Authorization**: Each user role should have appropriate access control to ensure data privacy.

#### 5. **System Components**

##### 5.1 **Order Management**

- A system to handle order creation, assignment to couriers, and real-time tracking.

##### 5.2 **Notification System**

- Email/SMS notification service to keep customers informed about their package status.

##### 5.3 **Tracking System**

- A real-time tracking system integrated with GPS to allow business owners and customers to track package status and location.

##### 5.4 **Communication Module**

- A messaging system for couriers and customers to arrange delivery times and provide status updates.

#### 6. **Future Enhancements**

- **Payment Integration**: Support for customers to pay for the product or delivery fee online.
- **Multi-Language Support**: Implement additional languages to accommodate more regions.
- **Analytics**: Provide business owners with insights on delivery times, success rates, and customer feedback.
