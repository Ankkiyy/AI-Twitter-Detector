from fastapi import APIRouter,HTTPException, status, Request
from pydantic import ValidationError
from api.models.Room import Room
from fastapi.responses import JSONResponse
from api.models.User import User
import re
router = APIRouter()

@router.get("/", response_description="Api Version 1 Manager route")
async def hello_world():
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "location": "api/v1/auth",
            "message": "API Version V1 - Initial Version",
            "version": "1.0.0",
            "status": 200,
            "status_message": "OK... Working Version 1",
            "data": {
                "message": "You are in Auth API Base"
            }
        }
    )
    
# Create Room Api 
# Description : Create a new room for Socket Server
# Request Type : POST
# Path : http://127.0.0.1:10007/api/v1/auth/user/create
# Default Port : 10007
@router.post("/user/create", response_description="Add New User")
async def create_user(request: Request):
    data = await request.json()
    firstname = data.get('first_name')
    lastname = data.get('last_name')
    email = data.get('email')
    password = data.get('password')
    phone = data.get('phone')
    phone2 = data.get('phone2')
    address = data.get('address')
    pin_code = data.get('pin_code')
    state = data.get('state')
    city = data.get('city')
    country = data.get('country')
   

    try:
        pattern=r'^[A-Za-z]+$'
        # return data
        if not re.match(pattern,firstname):
            raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="First name must contain only letters."
        )
        if not re.match(pattern,lastname):
            raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Last name must contain only letters ."
        )
        if not re.match(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$',email):
            raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email format."
        )
        password_pattern = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Z][A-Za-z\d\W_]{7,15}$'
        if not re.match(password_pattern,password ):
            raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must contain at least one uppercase letter, one lowercase letter, one digit, one special character and must be 8-16 characters long."
        )
        if not re.match(r'^\d{10}$',phone):
            raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phone number must be exactly 10 digits."
        )
        if not re.match(r'^\d{10}$',phone2):
            raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Optional phone number must be exactly 10 digits."
        )
        
        if not re.match(r'^\d{6}$',pin_code):
            raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Pin code must be exactly 6 digits."
        )   
        if not re.match(pattern,city):
            raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="City must contain only letters and spaces."
        )
        user = User(first_name=firstname, last_name=lastname, email=email, password=password, phone=phone, phone2=phone2, address=address, pin_code=pin_code, state=state, city=city, country=country)
        User.add_user(user.dict(by_alias=True))
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={
                "status": 201,
                "status_message": "Created",
                "data": {
                    "message": "User Created Successfully"
                }
            }
        )
    except ValidationError as e:
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "status": 422,
                "status_message": "Unprocessable Entity",
                "data": {
                    "message": e.errors()
                }
            }
        )
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "status": 500,
                "status_message": "Internal Server Error",
                "data": {
                    "message": str(e)
                }
            }
        )

# Changes the password 
# Description : Change new
# Request Type : POST
# Path : http://127.0.0.1:10007/api/v1/auth/user/change-password
# Default Port : 10007
@router.post("/user/change-password", response_description="Change Password")
async def change_password(request: Request):
    try:
        data = await request.json()
        email = data.get('email')
        password = data.get('password')
        confirm_password = data.get('confirm_password')
             
        # Check if the new password and confirm password match
        if password != confirm_password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password and confirm password do not match"
            )
        result = User.forgot_password(email, password, confirm_password)
        return result
    except HTTPException as http_exc:
        raise http_exc
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Get All Rooms Api
# Description : Get All Rooms from the Database
# Request Type : GET
# Path : http://localhost:port/api/v1/room/list
# Default Port : 10007
@router.post("/user/login", response_description="Get All Rooms")
async def user_login(request:Request):
    try:
        data =  await request.json()
        email = data.get('email')
        password = data.get('password')

        return User.login(email,password)
    except HTTPException as http_exc:
        raise http_exc
    except ValueError as e:  # Assuming Room.add_room raises ValueError when the room exists
        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,  # 409 Conflict for resource already existing
            content={
                "status": 409,
                "status_message": "Conflict",
                "data": {
                    "message": str(e)  # Example: "Room already exists"
                }
            }
        )
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "status": 500,
                "status_message": "Internal Server Error",
                "data": {
                    "message": str(e)
                }
            }
        )