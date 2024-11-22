from fastapi import APIRouter,HTTPException, status, Request
from pydantic import ValidationError
from fastapi.responses import JSONResponse
from api.extensions.ml.test import predict_tweet
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

@router.post("/predict", response_description="Add New User")
async def create_user(request: Request):
    data = await request.json()
    tweet = data.get('tweet')

    if not tweet:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tweet is required."
        )

    try:
        prediction = await predict_tweet(tweet)

        if prediction:
            prediction = "Hostile"
        else:
            prediction = "Non-Hostile"

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "prediction": prediction
            }
        )

    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
