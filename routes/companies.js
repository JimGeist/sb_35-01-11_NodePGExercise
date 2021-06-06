/** Routes for companies of BizTime. */

const db = require("../db");
const express = require("express");
const ExpressError = require("../expressError");
const { prepareCompanyInsert } = require("../helperFx");
const { dbInsert } = require("../dbFunctions");
const { response } = require("express");
const router = express.Router();


/** GET {/companies}/ ; return{companies: [{code, name}, ...]} */
router.get("/", async function (req, res, next) {

    try {
        const results = await db.query(
            `SELECT code, name FROM companies`);
        return res.json({ companies: results.rows });

    } catch (error) {
        return next(error);
    }

});

/** GET {/companies}/[code] ; return {company: {code, name, description}} **/
router.get("/:code", async function (req, res, next) {

    const inCode = req.params.code;

    try {
        const results = await db.query(
            `SELECT code, name, description 
            FROM companies 
            WHERE code = $1`, [inCode]
        );

        if (results.rows.length > 0) {
            return res.json({ company: results.rows });
        } else {
            let errorNotFound = new Error(`A company was not found for code '${inCode}'.`);
            errorNotFound.status = 404;
            throw errorNotFound;
        }

    } catch (error) {
        return next(error)
    }

});









/** POST {/companies}/ ; return new company object {company: {code, name, description}} **/
router.post("/", async function (req, res, next) {
    // Route adds a new company is added by using JSON inputs for code, name, and description
    // Returns new company object {company: {code, name, description}}
    // debugger

    // make sure non-blank values exist for code and name.
    // Order of requiredKeys in the list must match the order expected by the insert!!
    const requiredKeys = ["code", "name"];
    const resultsPreparation = prepareCompanyInsert(requiredKeys, req.body);
    if (resultsPreparation.success === false) {
        // An error occurred while validating the data when success is false.
        // const errorValidation = new Error(resultsPreparation["error"]);
        // bad request (400) -- required fields are missing.
        const errorValidation = new Error(resultsPreparation.error);
        errorValidation.status = 400;
        return next(errorValidation);
    }
    // debugger;
    console.log(`resultsPreparation.argumentsNbr=${resultsPreparation.insertData.argumentsNbr}`);
    console.log(`resultsPreparation.argumentsValues=${resultsPreparation.insertData.argumentsValues}`);
    console.log(`resultsPreparation.argumentsName=${resultsPreparation.insertData.argumentsName}`);

    const resultsInsert = await dbInsert(resultsPreparation.insertData, "companies");


    if (resultsInsert.success) {
        return res.json({ company: resultsInsert.insertReturn });
    } else {
        const errorInsert = new Error(resultsInsert.error.message);
        errorInsert.status = 500;
        return next(errorInsert);
    }

    // if (resultsValidation.allValid === false) {
    //     // bad request (400) -- all fields are needed when adding a company.
    //     const errorValidation = new Error(resultsValidation["error"]);
    //     errorValidation.status = 400;
    //     return next(errorValidation);
    // }

    // const insertValues = [];
    // let ctr = 1;
    // let insertArgs = "";
    // let insertDelim = ""
    // for (const key of requiredKeys) {
    //     console.log(`for: ctr=${ctr}, key=${key}, resultsValidation.fields[key]= ${resultsValidation.fields[key]}`)
    //     insertValues.push(resultsValidation.fields[key])
    //     // build the argument string, $1, $2, ... for the insert by adding to 
    //     //  insertArgs string each time through the loop.
    //     insertArgs = `${insertArgs}${insertDelim}$${ctr}`;
    //     ctr++;
    //     insertDelim = ", ";
    // }

    // // do we have a description? It is an outlier since it is not required.
    // if (req.body.description) {
    //     let description = (req.body.description).trim();
    //     if (description.length > 0) {
    //         // we have a description. put it in the value list.
    //         insertValues.push(description);
    //         // update insertArgs to show a $ctr. ctr and delim will 
    //         //  have correct values for appending to the argument string.
    //         insertArgs = `${insertArgs}${insertDelim}$${ctr}`;
    //     }

    // }

    // try {
    //     const result = await db.query(`
    //         INSERT INTO companies 
    //         VALUES (${insertArgs}) 
    //         RETURNING code, name, description 
    //     `, insertValues);
    //     return res.json({ company: result.rows[0] })

    // } catch (error) {
    //     return next(error);
    // }

});


// router.post("/", async function (req, res, next) {
//     // Route adds a new company is added by using JSON inputs for code, name, and description
//     // Returns new company object {company: {code, name, description}}
//     // debugger

//     // make sure non-blank values exist for code and name.

//     const requiredKeys = ["code", "name"];
//     const resultsValidation = validateRequired(requiredKeys, req.body);

//     if (resultsValidation.allValid === false) {
//         // bad request (400) -- all fields are needed when adding a company.
//         const errorValidation = new Error(resultsValidation["error"]);
//         errorValidation.status = 400;
//         return next(errorValidation);
//     }

//     let { code, name, description } = resultsValidation.fields;
//     console.log(`resultsValidation.fields=${resultsValidation.fields}`);
//     try {
//         const result = await db.query(`
//             INSERT INTO companies 
//             VALUES ($1, $2, $3) 
//             RETURNING code, name, description 
//         `, [code, name, description]);
//         return res.json({ company: result.rows[0] })

//     } catch (error) {
//         return next(error);
//     }

// });

// /** PUT {/companies}/[code] ; return edited company object {company: {code, name, description}} **/
// router.put("/:code", async function (req, res next) {
//     // Existing company idenified by code is upadated JSON inputs for name and description
//     // Returns edited company object {company: {code, name, description}} when successful or
//     //  404 / Company not found when the code was not found.

//     const valueList = [];
//     const code = req.params.code;
//     let updates = "";

//     const requiredKeys = ["name", "description"];
//     const resultsValidation = validateRequired(requiredKeys, req.body, false);
//     validateResults

//     try {
//         const result = await db.query(`
//             UPDATE companies 
//             SET ${updates} 
//             WHERE code = $1
//         `, valueList);

//     } catch (error) {
//         return next(error);
//     }

// });


/** DELETE {/companies}/[code] ; return deleted message {company: {status: "deleted"}} **/
// Deletes a company idenified by code.
// Returns {company: {status: "deleted"}} upon successful deletion or
//  404 / Company not found when the code was not found.




module.exports = router;