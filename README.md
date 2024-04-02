# Book Store Application Backend

This project is the backend implementation of a book store application, providing features for user management, book management, purchase history, and revenue tracking for authors.

## Setup

1. Clone this repository to your local machine.
2. Create a `.env` file based on the provided `.env.example`.
3. Fill in the `GMAILFORNODEMAILER` and `PASSWORDFORNODEMAILER` variables in the `.env` file with your email credentials.
4. Run `npm install` to install the required dependencies.
5. Start the server using `npm start`.

## Default Admin User

A default admin user is created with the following credentials:
- Username: `magadhtech`
- Password: `Magadh@12`

## API Endpoints

### User Management

- **Signup User**: `POST /v1/user/signup` - Create a new user. If `userType` is not provided, a retail user is created. Allowed user types are `admin`, `author`, and `retail`.
- **Login User**: `POST /v1/user/login` - Authenticate user with username and password.
- **Change Password**: `PUT /v1/user/change-password` - Change user's password.
- **View Profile**: `GET /v1/user/profile` - View user's profile information.
- **Update Profile**: `PUT /v1/user/profile/update` - Update user's profile information.
- **Create Admin User**: `POST /v1/user/create` - Create a new admin user. (Admin only)
- **View All Users**: `GET /v1/user/all` - View all users. (Admin only)
- **Update User by ID**: `PUT /v1/user/update/:id` - Update user by ID. (Admin only)
- **Delete User by ID**: `DELETE /v1/user/:id` - Delete user by ID. (Admin only)

### Book Management

- **Create Book**: `POST /v1/book/create` - Create a new book. (Author or Admin only)
- **Update Book**: `PUT /v1/book/:slug` - Update a book by its title slug. (Author or Admin only)
- **Publish Book**: `PUT /v1/book/make/publish` - Publish a book. Sends email notification to retail users. (Author or Admin only)
- **Fetch All Books**: `GET /v1/book/fetch` - Fetch all books with optional pagination and filtering. (All users)
- **Delete Book**: `DELETE /v1/book/:slug` - Delete a book by its title slug. (Admin only)

### Purchase History

- **Purchase Book**: `POST /v1/purchase/book` - Purchase a book. Sends email notification to authors with revenue information.

## Scheduled Tasks

- **Monthly Revenue Notification**: A cron job is scheduled to run on the last day of each month at 11:00 PM. It fetches all authors' revenue records and sends them to the queue. Only 100 emails are sent per minute.

## Contributors

- [@YourName](https://github.com/YourName) - Project Lead

Feel free to contribute and improve this project!
