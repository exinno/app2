from fastapi import FastAPI, Request, HTTPException, BackgroundTasks
from inference import run_inference
import uvicorn

app = FastAPI()

@app.post("/generate")
async def post(request: Request):
    return generate(await request.json())

@app.get("/generate")
async def get(request: Request):
    return generate(request.query_params)

def generate(params: any):
    if "prompt" not in params:
        raise HTTPException(status_code=400, detail="Prompt needs to provided as an input parameter")

    # print('prompt: ' + params['prompt'])

    output = run_inference(params)
    output = output[len(params['prompt']):]

    # print('output: ' + output)

    return {"text": output}

uvicorn.run(app, host="0.0.0.0", port=5000)