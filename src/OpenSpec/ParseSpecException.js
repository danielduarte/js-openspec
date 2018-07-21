class ParseSpecException extends Error
{
    constructor (message, code, errors = null) {
        super(message);

        this.code    = code;

        if (code === ParseSpecException.CODE_MULTIPLE_PARSER_ERROR) {
            let messages = errors.map((error) => { return error[1]; });

            message = message + "\n- " + messages.join("\n- ");

            this._errors = errors;
        } else {
            this._errors = [[code, message]];
        }
    }

    getErrors()
    {
        return this._errors;
    }
}

// @todo review these answer and the following line
// https://stackoverflow.com/questions/1382107/whats-a-good-way-to-extend-error-in-javascript#answer-43595019
ParseSpecException.prototype = Error.prototype;

ParseSpecException.prototype.containsError = function (code)
{
    let errorCodes = this._errors.map((error) => {
        return error[0];
    });

    return errorCodes.indexOf(code) >= 0;
};

ParseSpecException.CODE_GENERAL_PARSER_ERROR   =  1;
ParseSpecException.CODE_MULTIPLE_PARSER_ERROR  =  2;
ParseSpecException.CODE_INVALID_SPEC_DATA      =  7;
ParseSpecException.CODE_UNKNOWN_SPEC_TYPE      =  5;
ParseSpecException.CODE_INVALID_TYPE_NAME_TYPE =  6;
ParseSpecException.CODE_UNEXPECTED_FIELDS      =  9;
ParseSpecException.CODE_MISSING_REQUIRED_FIELD =  8;
ParseSpecException.CODE_INVALID_TYPE_NAME      = 10;
ParseSpecException.CODE_EXTENSIBLE_EXPECTED    = 11;
ParseSpecException.CODE_UNDEFINED_NAMED_SPEC   = 14;
ParseSpecException.CODE_NULL_EXPECTED          = 12;
ParseSpecException.CODE_BOOLEAN_EXPECTED       = 13;
ParseSpecException.CODE_INTEGER_EXPECTED       = 15;
ParseSpecException.CODE_FLOAT_EXPECTED         = 16;
ParseSpecException.CODE_STRING_EXPECTED        =  3;
ParseSpecException.CODE_ARRAY_EXPECTED         =  4;


export default ParseSpecException;
