from fastapi import APIRouter, HTTPException, Request ,status
from api.extensions.mail import MAIL
from api.models.Otp import Otp
import random
from  api.db import users_collection
from api.extensions.mail.otpHtmlVariable import getHtml
import re
router = APIRouter()

# https://localhost:10007/api/v1/mail
# https://localhost:10007/api/v1/mail/
@router.get("", response_description="Api Mail Home")
@router.get("/", response_description="Api Mail Home")
async def hello_world():
    return {
        "location" : "api/v1/mail",
        "message" : "API Version V1 - Initial Version",
        "version" : "1.0.0",
        "status" : 200,
        "status_message" : "OK... Working Mail Home",
        "data" : {
            "message" : "Welcome to the Mail Home"
        }
    }
    
    
# Send Mail Api
# Description : Send Mail to the User
# Request Type : POST
# Path : http://localhost:port/api/v1/mail/send-otp
# Path : http://localhost:10007/api/v1/mail/send-otp
# Default Port : 10007

@router.post("/send-otp" , response_description="Send OTP to the User")
async def send_otp(request: Request):
    try:
        body = await request.json()
        email = body.get("email")
        if not email:
            raise HTTPException(status_code=400, detail="Email is required")
        if not re.match(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$',email):
            raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email format."
        )
        user = users_collection.find_one({"email": email})
        if not user:
            raise HTTPException(status_code=400, detail="User not found")
        otp = random.randint(100000, 999999)
        # Add otp in DB for Verification
        MAIL.sendHtmlMail(email, "Furniture Management System", "OTP for the Verification", f"Your OTP is {otp}", getHtml(otp))
        Otp.add_otp(email, str(otp))
        return {
            "status" : 200,
            "status_message" : "OK",
            "data" : {
                "message" : "OTP Sent Successfully to " + email 
            }
        }
    except HTTPException as http_exc:
        raise http_exc
    except ValueError as e:
        detail = {
            "status": 400,
            "status_message": "Bad Request",
            "data": {
                "message": str(e)
            }
        }
        raise HTTPException(status_code=400, detail=detail)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



# Create Room Api 
# Description : Create a new room for Socket Server
# Request Type : POST
# Path : http://localhost:port/api/v1/mail/verify-otp
# Default Port : 10007
@router.post("/verify-otp", response_description="Add New Room")
async def verify_otp(request: Request):
    try:
        body = await request.json()
        email = body.get("email")
        
        if not email:
            raise HTTPException(status_code=400, detail="Email is required")
        
        otp = body.get("otp")
        
        if not otp:
            raise HTTPException(status_code=400, detail="OTP is required")
        
        if not Otp.verify_otp(email, otp):
            raise HTTPException(status_code=400, detail="Invalid OTP")

        return {
            "status" : 200,
            "status_message" : "OK",
            "data" : {
                "message" : "Otp Verified Successfully"
            }
        }
    except HTTPException as http_exc:
        raise http_exc  # Re-raise HTTPExceptions to allow FastAPI to handle them properly
    except ValueError as e:
        detail = {
            "status": 400,
            "status_message": "Bad Request",
            "data": {
                "message": str(e)
            }
        }
        raise HTTPException(status_code=400, detail=detail)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))