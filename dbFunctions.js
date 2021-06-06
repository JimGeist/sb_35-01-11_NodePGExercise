/** Database insert, update, select, and delete functions for BizTime. */

const db = require("./db");
const ExpressError = require("./expressError");
// const { validateRequired } = require("./helperFx");



async function dbInsert(insertData, table) {
    /*  dbInsert performs the db insert operation. It is table agnostic.

        insertArgs, string, "$1, $2, ... $n" argument placeholders for parameterized insert.
         
        insertValuesList, array, containing the values for each field inserted into the 
         table table.

        returnFields, string, the fields that are returned by the query.
         
        Function returns: 
        {
            success: true/false,
            insertReturn: {db value for each field in returnFields string},
            error: {
                message: message text
            }
        }

    */





    // try {
    //     const result = await db.query(`
    //         INSERT INTO ${table}  
    //         VALUES (${insertArgs}) 
    //         RETURNING ${returnFields} 
    //     `, insertValuesList);

    //     return {
    //         success: true,
    //         insertReturn: result.rows[0],
    //         error: {
    //             message: ""
    //         }
    //     }

    // } catch (error) {
    //     return {
    //         success: false,
    //         insertReturn: "",
    //         error: {
    //             message: error
    //         }
    //     }
    // }


    // return a new Promise
    return new Promise(async function (resolve, reject) {

        let result;
        try {
            result = await db.query(`
                INSERT INTO ${table}  
                VALUES (${insertData.argumentsNbr}) 
                RETURNING ${insertData.argumentsName} 
            `, insertData.argumentsValues);
            // RETURNING ${insertData.argumentsName}  [code, nam, desc] 
            resolve(
                {
                    success: true,
                    insertReturn: result.rows[0],
                    error: {
                        message: ""
                    }
                }
            )

        } catch (err) {
            // result = error;
            resolve(
                {
                    success: false,
                    insertReturn: "",
                    error: {
                        message: err
                    }
                }
            );

            // reject(
            //     {
            //         success: false,
            //         insertReturn: "",
            //         error: {
            //             message: err
            //         }
            //     }
            // );

        }

        // // inserted succeeded. Call resolve callback / set return values
        // resolve(
        //     {
        //         success: true,
        //         insertReturn: result.rows[0],
        //         error: {
        //             message: ""
        //         }
        //     }
        // );

        // // insert failed. Call the reject callback
        // reject(
        //     {
        //         success: false,
        //         insertReturn: "",
        //         error: {
        //             message: result
        //         }
        //     }
        // );

    });



    //   // return a new Promise
    //   return new Promise((resolve, reject) => {
    //     /*

    //       DO ASYNC STUFF HERE

    //     */

    //     // if it succeeds, call the resolve callback
    //     resolve(/* success value*/);

    //     // if it fails, call the reject callback
    //     reject(/* fail value*/);
    //   });


}


module.exports = {
    dbInsert: dbInsert
}