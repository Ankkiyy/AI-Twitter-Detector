from fastapi import HTTPException, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ValidationError
from api.db import users_collection
from bson.objectid import ObjectId
from typing import List, Optional
import re
class User(BaseModel):
    first_name: str 
    last_name: str 
    email: str
    password: str
    phone: str 
    phone2: Optional[str] 
    address: str
    pin_code: str 
    state: str
    type: str = "user"

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str
        }
    city: str
    country: str

    @staticmethod
    def add_user(user_data: dict)-> bool:
        """ Adds a new user to the collection. """
        try:
            
            if users_collection.find_one({'email': user_data['email']}):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already registered"
                )
            result = users_collection.insert_one(user_data)
            return True if result.inserted_id else False

        except Exception as e:
           
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=str(e)
            )

    @staticmethod
    def login(email: str, password: str) -> dict:
        """ Authenticates a user by their email and password. """
        user = users_collection.find_one({'email': email})
        if not user or user['password'] != password:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
            "status": 200,
            "status_message": "OK",
            "data": {
                "message": "Login successful",
                "user_id": str(user['_id'])
            }
            }
        )

    @staticmethod
    def forgot_password(email: str, password: str, confirm_password: str) :
        """ Handles forgot password functionality. """
        user = users_collection.find_one({'email': email})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Email not registered"
            )
                
        # Update the password in the database
        users_collection.update_one({'email': email}, {'$set': {'password': password}})
        #return {"message": "Password has been successfully updated. Please log in with your new password."}
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
            "status": 200,
            "status_message": "OK",
            "data": {
                "message": "Password has been successfully updated. Please log in with your new password."
            }
            }
        )