from fastapi import APIRouter
from api.versions.v1.room.root import router as room_router
from api.versions.v1.Mail.root import router as mail_router
from api.versions.v1.Auth.root import router as auth_router
from api.versions.v1.ml.root import router as ml_router

router = APIRouter()

# https://localhost:10007/api/v1
# https://localhost:10007/api/v1/

@router.get("", response_description="Api Version 1 Manager route")
@router.get("/", response_description="Api Version 1 Manager route")
async def hello_world():
    return {
        "location" : "api/v1",
        "message" : "API Version V1 - Initial Version",
        "version" : "1.0.0",
        "status" : 200,
        "status_message" : "OK... Working Version 1",
        "data" : {
            "message" : "Welcome to the API"
        }
    }

# https://localhost:10007/api/v1/room
router.include_router(room_router, prefix="/room", tags=["API Version 1"])

# https://localhost:10007/api/v1/mail
router.include_router(mail_router, prefix="/mail", tags=["mail Routes"])

# https://localhost:10007/api/v1/auth
router.include_router(auth_router, prefix="/auth", tags=["Auth Routes"])

# https://localhost:10007/api/v1/ml
router.include_router(ml_router, prefix="/ml", tags=["Machine Learning Routes"])

