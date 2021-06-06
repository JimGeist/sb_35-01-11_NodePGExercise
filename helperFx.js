/* helper functions, mostly validators */

function validateRequired(fieldList, source, allRequired = true) {
    /* Using fieldList, validateRequired, ensures the 
        field exists in the source and cleans the value 
        by removing leading and trailing spaces.

        fieldList is an array of fields. The fields must
         match spelling and case of the key in source.
        source is the source object, typically the request 
         object body.
        
        returns an object with an allValid true/false, the fields 
         and the cleaned values when all valid OR
        an error when any of the fields did not pass the validation.
        {
            allValid: true / false,
            fields {
                keys from fieldList: cleaned values from source obj
            },
            error: errors encountered
        }
         
    */

    const fields = {}
    let allValid = true;

    let errorValidation = "";
    let errorDelim = "";
    for (const key of fieldList) {
        console.log(`key: ${key}, req.body.${key} = '${source[key]}'`)
        if (source[key]) {
            // key exists with a value.
            fields[key] = source[key].trim();
        } else {
            if (allRequired) {
                // key is missing and all keys are required
                allValid = false;
                errorValidation = `${errorValidation}${errorDelim}'${key}'`;
                errorDelim = ", "
            }
        }
    }

    // build and return results
    if (allValid) {
        return {
            allValid: allValid,
            fields: fields,
            error: "",
        };
    } else {
        // Field(s) x required. Missing x,y,z. 
        errorValidation = `Field(s) ${fieldList} required. Missing ${errorValidation}.`;
        return {
            allValid: allValid,
            fields: {},
            error: errorValidation
        }
    }

}


function prepareCompanyInsert(requiredKeys, requestBody) {
    /*  prepareCompanyInsert prepares Company data from the request for eventual
         insert into the database.
        Route adds a new company is added by using JSON inputs for code, name, and description
         Returns new company object {company: {code, name, description}}
    
    */

    // debugger

    // make sure non-blank values exist for code and name.
    // Order of requiredKeys in the list must match the order expected by the insert!!
    // const requiredKeys = ["code", "name"];
    const resultsValidation = validateRequired(requiredKeys, requestBody);

    if (resultsValidation.allValid === false) {
        // bad request (400) -- all fields are needed when adding a company.
        // const errorValidation = new Error(resultsValidation["error"]);
        // errorValidation.status = 400;
        // return next(errorValidation);
        return {
            success: false,
            error: resultsValidation["error"]
        }
    }

    const insertValues = [];
    let ctr = 1;
    let insertArgs = "";
    let insertNames = "";
    let insertDelim = ""
    for (const key of requiredKeys) {
        console.log(`for: ctr=${ctr}, key=${key}, resultsValidation.fields[key]= ${resultsValidation.fields[key]}`)
        insertValues.push(resultsValidation.fields[key])
        // build the argument string, $1, $2, ... for the insert by adding to 
        //  insertArgs string each time through the loop.
        insertArgs = `${insertArgs}${insertDelim}$${ctr}`;
        insertNames = `${insertNames}${insertDelim}${key}`;
        ctr++;
        insertDelim = ", ";
    }

    // do we have a description? It is an outlier since it is not required.
    if (requestBody.description) {
        let description = (requestBody.description).trim();
        if (description.length > 0) {
            // we have a description. put it in the value list.
            insertValues.push(description);
            // update insertArgs to show a $ctr and insertNames to include
            //  descripiton. ctr and delim will have correct values for 
            //  appending to the argument string.
            insertArgs = `${insertArgs}${insertDelim}$${ctr}`;
            insertNames = `${insertNames}${insertDelim}description`;
        }

    }
    console.log(`insertArgs=${insertArgs}`);
    console.log(`insertValues=${insertValues}`);
    console.log(`insertNames=${insertNames}`);

    // const results = await dbInsert(insertArgs, insertValues, "code, name, description", "companies");

    return {
        success: true,
        insertData: {
            argumentsNbr: insertArgs,
            argumentsName: insertNames,
            argumentsValues: insertValues
        }
    };

}


module.exports = {
    prepareCompanyInsert: prepareCompanyInsert,
    validateRequired: validateRequired
};
