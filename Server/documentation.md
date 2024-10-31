# API documentation

## Endpoints Login

### POST /auth 
The route authenticates users in the system. By providing a valid login and password, the user receives a JWT token that allows access to other protected API routes.
#### Parameters
user_login: Registered user login in the system
user_password: Registered user password in the system

#### Request Example
```
{
	"user_login": "test",
    "user_password": "test"
}
```
#### Responses
##### Success! 200
If this response occurs, you will receive the JWT authentication token to access the other API routes.

Response Example:
```
{
    "token": "eyJhbGciOiJIUzI6W1ha1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJ0ZXN0ZSIsImlhdCI6MTY4OTI5MzQ3NiwiZXhwIjoxNjg5NDY2Mjc2fQ.Idv2KZox4TSZc77fcy-s9-VQMdKqtTJJ_9D-HEocvCQ"
}
```
##### User don't exists! 404
This response occurs when there is an error in user authentication.
Reasons: the user is not registered.

Response Example:
```
{
    "Message": "Not found"
}
```
##### Login or Password incorrect! 401
This response occurs when there is an error in user authentication.
Reasons: due to incorrect login or password.

Response Example:
```
{
    "Message": "Unauthorized"
}
``` 
##### Internal Error! 500
This response indicates a server error.
Reasons: Possibly due to issues such as file problems, server downtime, or database issues.

Response Example:
```
{
    "Error": "An error has ocurred"
}
```
##### Data error! 400
This response indicates an error in the data sent with the request.
Reasons: Such as incorrect data type or field size.

Response Example:
```
{
	"Error": "Expected string, received number"
}
```

### POST /recovery 
The route initiates the password recovery process by sending an email with instructions to reset the password. The request requires the registered email and the server instance's IP address handling the request.
#### Parameters
email: Email registered in the system.
instance: IP address of the server instance handling the request.

#### Request Example
```
{
	"email": "test@test.com",
    "instance": 127.0.0.1
}
```
#### Responses
##### Success! 200
Indicates that the email with instructions to reset the password was successfully sent.

Response Example:
```
{
    "Message": "Email sent"
}
```
##### Email not found! 404
Indicates that the provided email is not registered in the system.
Reasons: Email not registered.

Response Example:
```
{
    "Message": "Email not found"
}
```
##### Internal Error! 500
This response indicates a server error.
Reasons: Possibly due to issues such as file problems, server downtime, or database issues.

Response Example:
```
{
    "Error": "An error has ocurred"
}
```
##### Data error! 400
This response indicates an error in the data sent with the request.
Reasons: Such as incorrect data type or field size.

Response Example:
```
{
	"Error": "Expected string, received number"
}
```


## Endpoints Pre-User 
### GET /preusers 
The route retrieves a list of registered pre-users in the system. This endpoint does not require any parameters.
#### Parameters
No parameters is required.
#### Responses
##### Success! 200
If successful, this response returns a list of registered pre-users.

Response Example:
{
	"Pre_users": [
		{
			"id": 1,
			"email": "test@test.com",
			"name": "Test"
		}
	]
}
##### Internal Error! 500
This response indicates a server error.
Reasons: Possibly due to issues such as file problems, server downtime, or database issues.

Response Example:
```
{
    "Error": "An error has ocurred"
}
```

### POST /preuser 
The route allows for the registration of a new pre-user in the system by providing their name and email. This endpoint is used to create a new pre-user entry.
#### Parameters
name: Name of the new user to be registered in the system.
email: Email of the new user to be registered in the system.
#### Request Example
```
{
	"name": "test",
    "email": "test@test.com"
}
```
#### Responses
##### Created! 201
If successful, this response returns the created pre-user.

Response Example:
```
{
	"PreUser": {
		"id": 1,
		"name": "test",
		"email": "test@test.com"
	}
}
```
##### Email alredy exists! 409
This response indicates that a new pre-user cannot be registered.
Reasons: The email is already in use.

Response Example:
```
{
    "Message": "An operation could not be performed. Email already used"
}
```
##### Internal Error! 500
This response indicates a server error.
Reasons: Possibly due to issues such as file problems, server downtime, or database issues.

Response Example:
```
{
    "Error": "An error has ocurred"
}
```
##### Data error! 400
This response indicates an error in the data sent with the request.
Reasons: Such as incorrect data type or field size.

Response Example:
```
{
	"Error": "Expected string, received number"
}
```


## Endpoints User 
### GET /users 
The route retrieves a list of all registered users in the system. This endpoint is used for fetching user data without requiring any parameters.
#### Parameters
No parameters is required.

#### Responses
##### Success! 200
If successful, this response returns a list of users.

Response Example:
```
{
    "users":[
        {
            "id": 1,
            "name": "test",
            "email": "test@test",
            "login": "test"
        }
    ]
}
```
##### Internal Error! 500
This response indicates a server error.
Reasons: Possibly due to issues such as file problems, server downtime, or database issues.

Response Example:
```
{
    "Error": "An error has ocurred"
}
```

### POST /user 
The route registers a new user in the system. This endpoint requires the submission of user details, including their name, login, password, and email. It is essential to register a pre-user before creating a regular user.
#### Parameters
name: Name of the user to be registered in the system.
login: User login to be registered in the system.
password: Password of the user to be registered in the system.
email: Email of the user to be registered in the system.
#### Request Example
```
{
	"name": "testtest",
    "login": "testtest",
    "password": "testtest",
    "email": "test@test.com"
}
```

#### Responses
##### Created! 201
If successful, this response returns the created user.

Response Example:
{
	"id": 1,
	"name": "testtest",
	"login": "testtest",
	"email": "test@test.com"
}
##### Pre-user Not Found! 404
This response indicates that no pre-user is registered with the provided data.
Reasons: It is necessary to register a pre-user first.

Response Example:
{
    "Message": "Pre_user not found"
}
##### Email Already in Use! 409
This response indicates that the provided email is already registered to another user.
Reasons: Other user have already used email.

Response Example:
```
{
    "Message": "Email already used"
}
```
##### Internal Error! 500
This response indicates a server error.
Reasons: Possibly due to issues such as file problems, server downtime, or database issues.

Response Example:
```
{
    "Error": "An error has ocurred"
}
```
##### Data error! 400
This response indicates an error in the data sent with the request.
Reasons: Such as incorrect data type or field size.

Response Example:
```
{
	"Error": "Expected string, received number"
}
```

### GET /user/:name 
The route returns a list of all users registered in the system who have the requested parameters in their name. This endpoint is used to fetch a list of users
#### Parameters
name: name of the user who will be searched
#### Request example
The ID is passed as a URL parameter, so no body is needed for the request.
Example URL: /user/ByName/test
#### Responses
##### Success! 200 
If this response occurs, a list of users will be sent.

Response Example:
```
{
    users:[
        {
            id: 1,
            "name": "test",
            "email": "test@test.com",
        }
    ]
}
```
##### Internal Error! 500
This response indicates a server error.
Reasons: Possibly due to issues such as file problems, server downtime, or database issues.

Response Example:
```
{
    "Error": "An error has ocurred"
}
```
##### Data error! 400
This response indicates an error in the data sent with the request.
Reasons: Such as incorrect data type or field size.

Response Example:
```
{
	"Error": "Expected string, received number"
}
```

### GET /user/ById/:id
The route returns a user registered in the system who has the requested parameters. This endpoint is used to search for a user by id
#### Parameters
id: id of the user who will be searched
#### Request Example
The ID is passed as a URL parameter, so no body is needed for the request.
Example URL: /user/ById/:1
#### Responses
##### Success! 200
If this response occurs, a list of users will be sent.

Response Example:
```
{
    users:[
        {
            id: 1,
            "name": "test",
            "email": "test@test.com",
        }
    ]
}
```
##### User not found! 404
If this response occurs, user not found or not exists.

Response Example:
```
{
    "Message": "User not found"
}
```
##### Internal Error! 500
This response indicates a server error.
Reasons: Possibly due to issues such as file problems, server downtime, or database issues.

Response Example:
```
{
    "Error": "An error has ocurred"
}
```
##### Data error! 400
This response indicates an error in the data sent with the request.
Reasons: Such as incorrect data type or field size.

Response Example:
```
{
	"Error": "Expected string, received number"
}
```

### PATCH /user 
The route updates the information of an existing user in the system. You can modify the user's name by providing their unique identifier and the new name.
#### Parameters
id: Unique identifier of the user.
name: New name to update for the user.
#### Request Example
```
{
	"id": 1,
    "name": "test"
}
```
```
{
    "id": 1,
    "email": "test@test.com"
}
```
```
{
    "id": 1,
    "name": "test",
    "email": "test@test.com"
}
```
#### Reponses
##### Success! 200
If successful, this response returns the updated user.

Response Example:
```
{
    user:{
        "id": 1,
        "name": "test",
        "login": "test"
    }
}
```
##### Name Already Exists! 409
This response indicates that the user name could not be updated.
Reason:  Name is already in use.

Response Example:
```
{
    "Message": "Name already exists",
}
```
##### User email already exists! 409
This response indicates that the user name could not be updated.
Reason:  Email is already in use.

Response Example:
```
{
    "Message": "Email already exists",
}
```
##### User Not Found! 404
This response indicates that the user with the specified ID does not exist.
Reason: User don't exists.

Response Example:
```
{
     "Message": "User not found"
}
```
##### Internal Error! 500
This response indicates a server error.
Reasons: Possibly due to issues such as file problems, server downtime, or database issues.

Response Example:
```
{
    "Error": "An error has ocurred"
}
```
##### Data error! 400
This response indicates an error in the data sent with the request.
Reasons: Such as incorrect data type or field size.

Response Example:
```
{
	"Error": "Expected string, received number"
}
```



### PATCH /user/editPassword 
The route allows you to update the password of an existing user in the system. You must provide the user's unique identifier and the new password you want to set.
#### Parameters
id: Unique identifier of the user.
newPassword: New password to update for the user.
#### Request Example
```
{
	"id": 1,
    "newPassword": "test"
}
```
#### Responses
##### Success! 200
If successful, this response confirms that the password has been updated.

Response Example:
```
{
    "Message": "Password updated successfully"
}
```
##### User Not Found! 404
This response indicates that the user with the specified ID does not exist.
Reason: User don't exits.

Response Example:
```
{
     "Message": "User not found"
}
```
##### Internal Error! 500
This response indicates a server error.
Reasons: Possibly due to issues such as file problems, server downtime, or database issues.

Response Example:
```
{
    "Error": "An error has ocurred"
}
```
##### Data error! 400
This response indicates an error in the data sent with the request.
Reasons: Such as incorrect data type or field size.

Response Example:
```
{
	"Error": "Expected string, received number"
}
```

### DELETE /user 
The route allows you to remove a user from the system by their unique identifier. This action is restricted for administrator users, who cannot be deleted.
#### Parameters
id: Unique identifier of the user.
#### Request Example
The ID is passed as a URL parameter, so no body is needed for the request.
Example URL: /user/1
#### Responses
##### Success! 200
If successful, this response confirms that the user has been deleted from the system.

Response Example:
```
{
    "Message": "User deleted successfully"
}
```

##### Cannot Delete Admin User! 403
This response indicates that it is not possible to delete the administrator user from the system.
Reason: The admin user cannot be deleted.

Response Example:
```
{
    "Message": "It is not possible to delete the admin user",
} 
```
##### User Not Found! 404 OK
If this response occurs, it means that the requested user does not exist.
Reason: User don't exits.

Response Example:
```
{
   "Message": "User not found"
}
```
##### Internal Error! 500
This response indicates a server error.
Reasons: Possibly due to issues such as file problems, server downtime, or database issues.

Response Example:
```
{
    "Error": "An error has ocurred"
}
```
##### Data error! 400
This response indicates an error in the data sent with the request.
Reasons: Such as incorrect data type or field size.

Response Example:
```
{
	"Error": "Expected string, received number"
}
```

### PUT /reset/password 
The route allows users to reset their passwords using a unique token generated during the password recovery process. The new password will be set if the provided token is valid and has not been used.
#### Parameters
token: A unique token generated for password reset.
user_password: The new password to be set.
#### Request Example
```
{
	"token": "de0fcafe-c6a5-4db5-ac87-b88ece41b78c"
    "user_password": "test"
}
```
#### Responses
##### Success! 200
If this response occurs, the password has been updated.

##### Token already used! 400
The provided token has already been used for a password reset.
Reason: Token already used.

Response Example:
```
{
    "message": "Token alredy used"
}
```
##### Invalid token! 400
The provided token is invalid and cannot be used for resetting the password.
Reason: Invalid token.

Response Example:
```
{
    "Message": "Invalid token"
}
```
##### Internal Error! 500
This response indicates a server error.
Reasons: Possibly due to issues such as file problems, server downtime, or database issues.

Response Example:
```
{
    "Error": "An error has ocurred"
}
```
##### Data error! 400
This response indicates an error in the data sent with the request.
Reasons: Such as incorrect data type or field size.

Response Example:
```
{
	"Error": "Expected string, received number"
}
```

## Endpoints Category 
### POST /category OK
The route allows users to create a new category in the system by providing a unique name for the category.
#### Parameters
name: The name of the category to be created.
#### Request Example
```
{
	"name": "categoryExample"
}
```
#### Responses
##### Created! 201
If this response occurs, the created category will be returned.

Response Example:
```
{
    "Category": "categoryExample"
}
```
##### Category already exists! 409
If this response occurs, it means that the category name provided has already been used.
Reasons: Name already exists.

Response Example:
```
{
    "Message": "Category already exists"
}
```
##### Internal Error! 500
This response indicates a server error.
Reasons: Possibly due to issues such as file problems, server downtime, or database issues.

Response Example:
```
{
    "Error": "An error has ocurred"
}
```
##### Data error! 400
This response indicates an error in the data sent with the request.
Reasons: Such as incorrect data type or field size.

Response Example:
```
{
	"Error": "Expected string, received number"
}
```

### GET /categories 
The route retrieves a list of all categories registered in the system.
#### Parameters
No parameters is required.
#### Responses
##### Success! 200
If this response occurs, a list of categories will be returned.

Response Example:
```
{
    "Categories":[
        {
            "id": 1,
            "name": "categoryExample'"
        }
    ]
}
```
##### Internal Error! 500
This response indicates a server error.
Reasons: Possibly due to issues such as file problems, server downtime, or database issues.

Response Example:
```
{
    "Error": "An error has ocurred"
}
```

### GET /category/:id 
This endpoint retrieves a specific category by its unique identifier.
#### Parameters
id: The unique identifier of the category.
#### Request Example
The ID is passed as a URL parameter, so no body is needed for the request.
Example URL: /category/1
#### Responses
##### Success! 200
If this response occurs, the requested category will be returned.

Response Example:
```
{
    "Category":{
        "id": 1,
        "name": "categoryExample"
    }
}
```
##### Category not found! 404
If this response occurs, the category with the specified ID was not found.
Reasons: Category doesn't exist.

Response Example:
```
{
    "Message": "Category doesn't exist"
}
```
##### Internal Error! 500
This response indicates a server error.
Reasons: Possibly due to issues such as file problems, server downtime, or database issues.

Response Example:
```
{
    "Error": "An error has ocurred"
}
```
##### Data error! 400
This response indicates an error in the data sent with the request.
Reasons: Such as incorrect data type or field size.

Response Example:
```
{
	"Error": "Expected string, received number"
}
```

### GET /category/name/:name 
This endpoint retrieves a specific category by its name.
#### Parameters
name: The name of the category.
#### Request example
The name is passed as a URL parameter, so no body is needed for the request.
Example URL: /category/name/categoryExample
#### Responses
##### Success! 200
If this response occurs, the requested category will be returned.

Response Example:
```
{
    "Category":{
        "id": 1,
        "name": "categoryExample"
    }
}
```
##### Category not found! 404
If this response occurs, the category with the specified name was not found.
Reasons: Category doesn't exist.

Response Example:
```
{
    "Message": "Category doesn't exist"
}
```
##### Internal Error! 500
This response indicates a server error.
Reasons: Possibly due to issues such as file problems, server downtime, or database issues.

Response Example:
```
{
    "Error": "An error has ocurred"
}
```
##### Data error! 400
This response indicates an error in the data sent with the request.
Reasons: Such as incorrect data type or field size.

Response Example:
```
{
	"Error": "Expected string, received number"
}
```

### PUT /category 
This endpoint allows users to update an existing category.
#### Parameters
id: The unique identifier of the category to be updated.
name: The new name for the category.
#### Request Example
```
{
	"id": 1,
    "name": "categoryExample"
}
```
#### Responses
##### Success! 200
If this response occurs, the updated category will be returned.

Response Example:
```
{
	"id": 1,
    "name": "categoryExample"
}
```
##### Name already exists! 409
If this response occurs, it means that the category name is already being used by another category.
Reason: Name already used.

Response Example:
```
{
    "Message": "Name of category alredy exists"
}
```
##### Category not found! 404
If this response occurs, it means that the requested category does not exist.
Reason: Category not found.

Response Example:
```
{
    "Message": "Category not found"
}
```
##### Internal Error! 500
This response indicates a server error.
Reasons: Possibly due to issues such as file problems, server downtime, or database issues.

Response Example:
```
{
    "Error": "An error has ocurred"
}
```
##### Data error! 400
This response indicates an error in the data sent with the request.
Reasons: Such as incorrect data type or field size.

Response Example:
```
{
	"Error": "Expected string, received number"
}
```

### DELETE /category
This endpoint deletes an existing category by its unique identifier.
#### Parameters
id: The unique identifier of the category to be deleted.
#### Request example
```
{
	"id": 1
}
```
#### Reponses
##### Success! 200
If successful, this response confirms that the category has been deleted from the system.

Response Example:
```
{
    "Message": "Category deleted successfully"
}
```
##### Category not found! 404
If this response occurs, it means that the requested category does not exist.
Reasons: Category don't exits.

Response Example:
```
{
    "Message": "Category not found"
}
```
##### Deletion not possible! 409
If this response occurs, it means that the category cannot be deleted because it has associated products.
Reasons: It is not possible to delete a category with registered products.

Response Example:
```
{
    "Message": "it is not possible to delete a category with registered products"
}
```
##### Internal Error! 500
This response indicates a server error.
Reasons: Possibly due to issues such as file problems, server downtime, or database issues.

Response Example:
```
{
    "Error": "An error has ocurred"
}
```
##### Data error! 400
This response indicates an error in the data sent with the request.
Reasons: Such as incorrect data type or field size.

Response Example:
```
{
	"Error": "Expected string, received number"
}
```

## Endpoints Supplier OK
### GET /suppliers OK
This endpoint retrieves a list of all suppliers.
#### Parameters
No parameters is required.
#### Responses
##### Success! 200
If this response occurs, a list of suppliers will be returned.

Response Example:
```
{
    Suppliers:[
        {
            "id": 1
            "name": "supplierExample",
            "phone": "(00)00000-0000",
            "email": "test@test.com"
        }
    ]
}
```
##### Internal Error! 500
This response indicates a server error.
Reasons: Possibly due to issues such as file problems, server downtime, or database issues.

Response Example:
```
{
    "Error": "An error has ocurred"
}
```

### POST /supplier OK
The route registers a new supplier in the system.
#### Parameters
name: Name of the supplier to be registered.
phone: Phone number of the supplier to be registered.
email: Email of the supplier to be registered.
#### Request Example
```
{
	"name": "supplierExample",
    "phone": "(00)00000-0000",
    "email": "test@test.com"
}
```
#### Responses
##### Created! 201 
If this response occurs, the created supplier will be returned.

Response Example:
```
{
    "id": 1,
    "name": "test",
    "phone": "(00)00000-0000",
    "email": "test@test.com"
}
```
##### Registration not possible! 409 
If this response occurs, it means that it was not possible to register the supplier because the phone or email is already in use.
Reasons:  Phone or email already used.

Response Example:
```
{
    "Message": "phone or email already used"
}
```
##### Internal Error! 500
This response indicates a server error.
Reasons: Possibly due to issues such as file problems, server downtime, or database issues.

Response Example:
```
{
    "Error": "An error has ocurred"
}
```
##### Data error! 400
This response indicates an error in the data sent with the request.
Reasons: Such as incorrect data type or field size.

Response Example:
```
{
	"Error": "Expected string, received number"
}
```

### GET /supplier/:id OK
This endpoint retrieves a supplier by their unique identifier.
#### Parameters
id: Unique identifier of the supplier.(passed as a URL parameter).
#### Request example
The ID is passed as a URL parameter, so no body is needed for the request.
Example URL: /supplier/1 
#### Responses
##### Success! 200
If this response occurs, the requested supplier is returned.

Response Example:
```
{
    "id": 1,
    "name": "supplierExample",
    "phone": "(00)00000-0000",
    "email": "test@test.com"
}
```
##### Supplier not found! 404
If this response occurs, it means that the requested supplier does not exist in the system.
Reasons: Supplier does not exist.

Response Example:
```
{
    "Message": "Supplier does not exist"
}
```
##### Internal Error! 500
This response indicates a server error.
Reasons: Possibly due to issues such as file problems, server downtime, or database issues.

Response Example:
```
{
    "Error": "An error has ocurred"
}
```
##### Data error! 400
This response indicates an error in the data sent with the request.
Reasons: Such as incorrect data type or field size.

Response Example:
```
{
	"Error": "Expected string, received number"
}
```

### GET /supplier/findByName/:name OK
This endpoint retrieves a supplier by their name.
#### Parameters
name: Name of the requested supplier (passed as a URL parameter).
#### Request example
The ID is passed as a URL parameter, so no body is needed for the request.
Example URL: /supplier/findByName/test
#### Response
##### Success! 200
If this response occurs, the requested supplier is returned.

Response Example:
```
{
    id: 1,
    name: "supplierExample",
    phone: "(00)00000-0000",
    email: "test@test.com"
}
```
##### Supplier not found! 404
If this response occurs, it means the supplier with the specified name does not exist in the system.
Reasons: Supplier does not exist.

Response Example:
```
{
    "Message": "Supplier not found"
}
```
##### Internal Error! 500
This response indicates a server error.
Reasons: Possibly due to issues such as file problems, server downtime, or database issues.

Response Example:
```
{
    "Error": "An error has ocurred"
}
```
##### Data error! 400
This response indicates an error in the data sent with the request.
Reasons: Such as incorrect data type or field size.

Response Example:
```
{
	"Error": "Expected string, received number"
}
```

### PUT /supplier OK
This endpoint updates the information for an existing supplier.
#### Parameters
id: Unique identifier of the supplier to be updated.
name: New name for the supplier.
phone: New phone number for the supplier.
email: New email for the supplier.
#### Request Example
```
{
	"id": 1,
    "name": "supplierExample",
    "phone": "(00)00000-0000",
    "email": "test@test.com"
}
```
#### Responses
##### Success! 200
If this response occurs, the supplier has been successfully updated, and the updated supplier data is returned.

Response Example:
```
{
    id: 1,
    name: "supplierExample",
    phone: "(00)00000-0000",
    email: "test@test.com"
}
```
##### Supplier not found! 404
If this response occurs, it means the supplier was not found in the system.
Reasons: Supplier does not exist.

Response Example:
```
{
    "Message": "Supplier not found"
}
```
##### Invalid data type! 409
If this response occurs, it was not possible to update the supplier due to duplicate phone or email.
Reasons: Phone or email already in use.

Reponse Example:
```
{
    "Message": "Phone or email already in use"
}
```
##### Internal Error! 500
This response indicates a server error.
Reasons: Possibly due to issues such as file problems, server downtime, or database issues.

Response Example:
```
{
    "Error": "An error has ocurred"
}
```
##### Data error! 400
This response indicates an error in the data sent with the request.
Reasons: Such as incorrect data type or field size.

Response Example:
```
{
	"Error": "Expected string, received number"
}
```

### DELETE /supplier OK
This endpoint deletes an existing supplier based on the provided unique identifier.
#### Parameters
id: Unique identifier of the supplier to be deleted.
#### Request example
```
{
	"id": 1
}
```
#### Responses
##### Success! 200
If this response occurs, the supplier has been successfully deleted.

Response Exemple:
```
{
    "Message": "Supplier deleted successfully"
}
```

##### Supplier not found! 404
If this response occurs, it means that the supplier was not found in the system.
Reasons: Supplier does not exist.

Response Example:
```
{
    "Message": "Supplier not found"
}
```
##### Internal Error! 500
This response indicates a server error.
Reasons: Possibly due to issues such as file problems, server downtime, or database issues.

Response Example:
```
{
    "Error": "An error has ocurred"
}
```
##### Data error! 400
This response indicates an error in the data sent with the request.
Reasons: Such as incorrect data type or field size.

Response Example:
```
{
	"Error": "Expected string, received number"
}
```


## Endpoints Product OK
### GET /products OK
This endpoint retrieves a list of all products.
#### Parameters
No parameters is required.

#### Responses
##### Success! 200
If this response occurs, a list of created products is returned.

Response Example:
```
{
    Products:[
        {
            "id": 1,
            "name": "ProductExample",
            "price": 1000,
            "costPrice": 500,
            "mininmunQuantity": 200,
            "observation": "Example",
            "totalQuantityInStock": 0,
            "category_id": 1
        }
    ]
}
```
##### Internal Error! 500
This response indicates a server error.
Reasons: Possibly due to issues such as file problems, server downtime, or database issues.

Response Example:
```
{
    "Error": "An error has ocurred"
}
```

### POST /product OK
This endpoint registers a new product in the system.
#### Parameters
name: Name of the product.
price: Price of the product.
costPrice:  Cost price of the product.
minimunQuantity: Minimum quantity required in stock before marking it as a missing product.
observation: Note on the product.
category_id: Unique identifier of the category to which the product belongs.

#### Request Example
```
{
    "name": "ProductExample",
    "price": 1000,
    "costPrice": 500,
    "minimunQuantity": 200,
    "observation": "Example",
    "category_id": 1
}
```
#### Responses
##### Created! 201
The product has been created and returned.

Response Example:
```
{
    "name": "ProductExample",
    "price": 1000,
    "costPrice": 500,
    "minimunQuantity": 200,
    "observation": "Example",
    "category_id": 1
}
```
##### Product already exists! 409
A product with the same name already exists in the system.

Response Example:
```
{
    "Message": "Product already exists"
}
```
##### Internal Error! 500
This response indicates a server error.
Reasons: Possibly due to issues such as file problems, server downtime, or database issues.

Response Example:
```
{
    "Error": "An error has ocurred"
}
```
##### Data error! 400
This response indicates an error in the data sent with the request.
Reasons: Such as incorrect data type or field size.

Response Example:
```
{
	"Error": "Expected string, received number"
}
```

### GET /product/category/:category_id OK
This endpoint retrieves all products associated with a specific category.
#### Parameters
id: Unique identifier of the category to filter products by.
#### Request example
The category ID is passed as a URL parameter, so no body is required for the request.
Example URL: /product/category/1

#### Responses
##### Success! 200
Returns a list of products within the specified category.

Response Example:
```
{
    Products:[
        {
            "id": 1,
            "name": "ProductExample",
            "price": 1000,
            "costPrice": 500,
            "minimunQuantity": 200,
            "observation": "Example",
            "category_id": 1
        }
    ]
}
```
##### Category not found! 404
The specified category does not exist in the system.

Response Example:
```
{
    "Message": "Category not found"
}
```
##### Internal Error! 500
This response indicates a server error.
Reasons: Possibly due to issues such as file problems, server downtime, or database issues.

Response Example:
```
{
    "Error": "An error has ocurred"
}
```
##### Data error! 400
This response indicates an error in the data sent with the request.
Reasons: Such as incorrect data type or field size.

Response Example:
```
{
	"Error": "Expected string, received number"
}
```

### PUT /product OK
This endpoint updates the details of an existing product based on its unique identifier.
#### Parameters
id: Unique product identifier to be updated.
name: New name for the product.
price: New price for the product.
costPrice: New cost price for the product.
minimunQuantity: New minimum quantity for the product.
observation: New observation for the product.
category_id: New category identifier for the product.
#### Request Example
```
{
	"name": "ProductExample",
    "price": 1000,
    "costPrice": 200,
    "minimunQuantity": 200,
    "observation": "Example",
    "category_id": 1
}
```
#### Responses
##### Success! 200
The product has been updated successfully.

Response Example:
```
{
    "id": 1,
    "name": "ProductExample",
    "price": 1000,
    "costPrice": 200,
    "minimunQuantity": 200,
    "observation": "Example",
    "category_id": 1
}
```
##### Name already exists! 409
The product update failed.
Reasons: A product with the same name already exists.

Response Example:
```
{
    "Message": "could not update product, name already exists"
}
```
##### Internal Error! 500
This response indicates a server error.
Reasons: Possibly due to issues such as file problems, server downtime, or database issues.

Response Example:
```
{
    "Error": "An error has ocurred"
}
```
##### Data error! 400
This response indicates an error in the data sent with the request.
Reasons: Such as incorrect data type or field size.

Response Example:
```
{
	"Error": "Expected string, received number"
}
```

### DELETE /product OK
This endpoint deletes an existing product based on its unique identifier.
#### Parameters
id: Unique product identifier to be deleted.
#### Request Example
```
{
    "id": 1
}
```
#### Responses
##### Success! 200
The product has been deleted from the system.

##### Not possible! 409
It is not possible to delete the product.
Reasons: Product has stock.

Response Example:
```
{
    "Message": "It is not possible to delete the product! Product has quantity in stock!"
}
```
##### Internal Error! 500
This response indicates a server error.
Reasons: Possibly due to issues such as file problems, server downtime, or database issues.

Response Example:
```
{
    "Error": "An error has ocurred"
}
```
##### Data error! 400
This response indicates an error in the data sent with the request.
Reasons: Such as incorrect data type or field size.

Response Example:
```
{
	"Error": "Expected string, received number"
}
```


## Endpoints Batch VERIFICAR
### GET /batchs OK
This endpoint retrieves the list of all batches registered in the system.
#### Parameters
No parameters required.

#### Responses
##### Success! 200
If this response occurs, the list of all batches registered in the system will be returned.

Response Example:
```
{
    Batchs:[
        {
            "id": 1,
            "expirationDate": "2024-01-01",
            "quantity": 2,
            "dateTimeEmptyStock": "2024-01-01",
            "product_id": 1,
            "eValidationStatus": 1,
            "createdAt": "2024-01-01",
            "updatedAt": "2024-01-01"
        }
    ]
}
```
##### Internal Error! 500
This response indicates a server error.
Reasons: Possibly due to issues such as file problems, server downtime, or database issues.

Response Example:
```
{
    "Error": "An error has ocurred"
}
```

### GET /batch/product/:product_id
This endpoint retrieves all batches associated with a specific product, identified by its unique product_id.
#### Parameters
product_id: Unique identifier of the product for which batches will be listed. This parameter is passed in the URL.
#### Request example
The ID is passed as a URL parameter, so no body is needed for the request.
Example URL: /batch/product/1

#### Responses
##### Success! 200
If this response occurs, the list of all batches of the selected product will be returned.

Response Example:
```
{
    Batchs:[
        {
            "id": 1,
            "expirationDate": "2024-01-01",
            "quantity": 2,
            "dateTimeEmptyStock": "2024-01-01",
            "product_id": 1,
            "eValidationStatus": 1,
            "createdAt": "2024-01-01",
            "updatedAt": "2024-01-01"
        }
    ]
}
```
##### Internal Error! 500
This response indicates a server error.
Reasons: Possibly due to issues such as file problems, server downtime, or database issues.

Response Example:
```
{
    "Error": "An error has ocurred"
}
```
##### Data error! 400
This response indicates an error in the data sent with the request.
Reasons: Such as incorrect data type or field size.

Response Example:
```
{
	"Error": "Expected string, received number"
}
```

### POST /batch OK
This endpoint allows you to create or update a batch for a specific product by performing supply operations such as addition or subtraction of quantities.
#### Parameters
product_id: Unique identifier of the product that will receive the supply.
expirationDate: Expiration date of the batch.
quantity: Quantity that will be moved (added or subtracted).
operation:  Indicates which operation will be performed:
    1 - Addition
    2 - Subtraction
#### Request Example
```
{
	"product_id": 1,
    "expirationDate": "2024-01-01",
    "quantity": 50,
    "operation": 1
}
```
#### Responses
##### Success! 200
If this response occurs, the movement carried out with the batch and the new quantity will be returned.

Response Example:
```
{
    "id": 1,
    "expirationDate": "2024-01-01",
    "quantity": 2,
    "dateTimeEmptyStock": "2024-01-01",
    "product_id": 1,
    "eValidationStatus": 1,
    "createdAt": "2024-01-01",
    "updatedAt": "2024-01-01"   
}
```
##### Batch not found! 404
If this response occurs, the batch was not found.
Reasons: Batch not registered or not found.

Response Example:
```
{
    "Message": "batch not found"
}
```
##### Insufficient quantity! 409
If this response occurs, it was not possible to carry out the movement.
Reasons: The quantity in stock is less than requested.

Response Example:
```
{
    "Message": "Insufficient stock to withdraw quantity"
}
``` 
##### Internal Error! 500
This response indicates a server error.
Reasons: Possibly due to issues such as file problems, server downtime, or database issues.

Response Example:
```
{
    "Error": "An error has ocurred"
}
```
##### Data error! 400
This response indicates an error in the data sent with the request.
Reasons: Such as incorrect data type or field size.

Response Example:
```
{
	"Error": "Expected string, received number"
}
```

### DELETE /batch VERIFICAR
#### Parameters

#### Request example
```
{
	
}
```
#### Answers
##### Internal Error! 500
This response indicates a server error.
Reasons: Possibly due to issues such as file problems, server downtime, or database issues.

Response example:
```
{
    "Error": "An error has ocurred"
}
```
##### Data error! 400
This response indicates an error in the data sent with the request.
Reasons: Such as incorrect data type or field size.

Response example:
```
{
	"error": "Expected string, received number"
}
```
======================================================