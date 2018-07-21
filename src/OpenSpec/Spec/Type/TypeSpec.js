import SpecBuilder from "../../SpecBuilder";
import ParseSpecException from "../../ParseSpecException";
import Spec from "../Spec";


// @todo move this util function to a more apropriate place
const array_diff = function (array1, array2) {
    return array1.filter(function (elem) {
        return array2.indexOf(elem) === -1;
    });
};

class TypeSpec extends Spec
{
    constructor(specData, library)
    {
        super();

        this._initValues();

        this._anySpec = null;
        this._library = library;

        let errors = this._validateSpecData(specData);

        if (errors.length > 0) {
            throw new ParseSpecException('Invalid spec data.', ParseSpecException.CODE_MULTIPLE_PARSER_ERROR, errors);
        }
    }

/*
    public abstract function getTypeName(): string;

    public abstract function getRequiredFields(): array;
*/
    _getAnySpec()
    {
        if (this._anySpec === null) {
            let anySpecData = {
                type: 'mixed',
                options: [
                    { type: 'null' },
                    { type: 'boolean' },
                    { type: 'string' },
                    { type: 'integer' },
                    { type: 'float' },
                    { type: 'array' }, // Array option must be before object, to avoid generating objects when they're "normal" arrays.
                    { type: 'object', extensible: true },
                ],
            };

            this._anySpec = SpecBuilder.getInstance().build(anySpecData, this._library);
        }

        return this._anySpec;
    }

    getAllFields()
    {
        let reqFields = this.getRequiredFields();
        let optFields = this.getOptionalFields();

        return [...reqFields, ...optFields];
    }

     _validateSpecData(specData)
    {
        let errors = [];

        // Check if specData is an object non-array
        if (typeof specData !== 'object' || Array.isArray(specData)) {
            errors.push([ParseSpecException.CODE_ARRAY_EXPECTED, "Expected array with spec data, '" + (typeof specData) + "' given."]);
            return errors;
        }

        // Check for required fields that are not present
        let givenFields = Object.keys(specData);
        let requiredFields = this.getRequiredFields();
        let missingRequiredFields = array_diff(requiredFields, givenFields);
        if (missingRequiredFields.length > 0) {
            let missingRequiredMetakeysStr = '\'' + missingRequiredFields.join('\', \'') + '\'';
            errors.push([ParseSpecException.CODE_MISSING_REQUIRED_FIELD, "Missing required field(s) $missingRequiredMetakeysStr in type spec '" + this.getTypeName() + "'."]);
        }

        // Check for unexpected fields
        let allValidFields = this.getAllFields();
        let unexpectedFields = array_diff(givenFields, allValidFields);
        if (unexpectedFields.length > 0) {
            let unexpectedFieldsStr = '\'' + unexpectedFields.join('\', \'') + '\'';
            errors.push([ParseSpecException.CODE_UNEXPECTED_FIELDS, "Invalid spec data. Unexpected field(s) $unexpectedFieldsStr."]);
        }

        let validGivenFields = array_diff(givenFields, unexpectedFields);
        let fieldsErrors = this._validateFieldsSpecData(specData, validGivenFields);
        errors = [...errors, ...fieldsErrors];

        return errors;
    }

    _validateFieldsSpecData(specData, fields)
    {
        let errors = [];

        fields.forEach((field) => {
            let fieldValidationMethodName = '_validateFieldSpecData_' + field;
            let fieldErrors = this[fieldValidationMethodName](specData[field]);
            errors = [...errors, ...fieldErrors];
        });

        return errors;
    }

    _validateFieldSpecData_type(fieldValue)
    {
        let errors = [];
        let expectedValue = this.getTypeName();
        if (fieldValue !== expectedValue) {
            errors.push([ParseSpecException.CODE_INVALID_TYPE_NAME, "Expected 'type' field to have the value '$expectedValue', but '$fieldValue' given.'"]);
        }

        return errors;
    }
}


export default TypeSpec;
