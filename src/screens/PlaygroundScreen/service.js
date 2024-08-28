// import { getFormSubmissionInfo } from "react-router-dom/dist/dom";

const languageCodeMap = {
    cpp: 54,
    python: 92,
    javascript: 93,
    java: 91,
}

async function getSubmission(tokenId, callback){
    const url = `https://judge0-ce.p.rapidapi.com/submissions/${tokenId}?fields=*`;
    const options = {
        method: 'GET',
        headers: {
            'content-type': 'application/octet-stream',
            'X-RapidAPI-Key': '8e661ff0f2msh264ef2824d7658ap1aa5eejsn8786e1085f9f',
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        }
    };

    try{
        const response = await fetch(url, options);
        const result = await response.json();
        return result;
    }
    catch (error) {
        callback({apiStatus:'error', message: JSON.stringify(error)});
    }
}

export async function makeSubmission({code, language, callback, stdin}){

    const url = 'https://judge0-ce.p.rapidapi.com/submissions?fields=*';
    const httpOptions = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': '8e661ff0f2msh264ef2824d7658ap1aa5eejsn8786e1085f9f',
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        },
        body:JSON.stringify({
            language_id: languageCodeMap[language],
            source_code: code,
            stdin: stdin,
        })
    }

    try{
        callback({apiStatus: 'loading'})
        const response = await fetch(url, httpOptions);
        const result = await response.json();
        const tokenId = result.token;
        let statusCode = 1;
        let apiSubmissionResult;
        while(statusCode === 1 || statusCode === 2){
            try{
                const apiSubmissionResult = await getSubmission(tokenId);
                statusCode = apiSubmissionResult.status.id;
            }

            catch(error){
                callback({apiStatus: 'error', message: JSON.stringify(error)});
                break;
                return;
            }
            
            // const response = await getFormSubmissionInfo(tokenId)
        }
        if(apiSubmissionResult){
            callback({apiStatus: 'success', data: apiSubmissionResult});

        }

        // const result = await getFormSubmissionInfo(response);
        // console.log({result});
        
    }
    catch(error){
        callback({
            apiStatus: 'error',
            message: JSON.stringify(error)
        })
    }


}
