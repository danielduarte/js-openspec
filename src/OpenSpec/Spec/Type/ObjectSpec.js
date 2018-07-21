import Entity             from "../../Entity";
import SpecBuilder        from "../../SpecBuilder";
import TypeSpec           from "./TypeSpec";
import ParseSpecException from "../../ParseSpecException";


// @todo move this util function to a more apropriate place
const array_diff = function (array1, array2) {
    return array1.filter(function (elem) {
        return array2.indexOf(elem) === -1;
    });
};

// @todo see if should check that objects does not have fields duplicated
class ObjectSpec extends TypeSpec
{
    _initValues() {
        this._fieldSpecs = {};
        this._requiredFields = [];
        this._extensible = false;
        this._extensionFieldsSpec = null;
    }

    getTypeName()
    {
        return 'object';
    }

    getRequiredFields()
    {
        return ['type'];
    }

    getOptionalFields()
    {
        return ['fields', 'extensible', 'extensionFields', 'requiredFields'];
    }

    isValidFieldName(fieldName)
    {
        // @todo should the string $fieldName be checked to make sure it is a valid identifier?
        return this._extensible || this._fieldSpecs.hasOwnProperty(fieldName);
    }

    _validateFieldSpecData_fields(fieldValue)
    {
        let errors = [];

        if (typeof fieldValue !== 'object' || Array.isArray(fieldValue)) {
            errors.push([ParseSpecException.CODE_ARRAY_EXPECTED, "Object expected as value of 'fields' field, but " + (typeof fieldValue) + " given."]);
            return errors;
        }

        let expectedIndex = 0;
        for (let fieldKey in fieldValue) if (fieldValue.hasOwnProperty(fieldKey)) {
            let fieldSpecData = fieldValue[fieldKey];
            try {
                this._fieldSpecs[fieldKey] = SpecBuilder.getInstance().build(fieldSpecData, this._library);
            } catch (ex) {

                if (!(ex instanceof ParseSpecException)) {
                    throw new Error('Unexpected exception.');
                }

                let fieldErrors = ex._errors; // @todo check how to use ->getErrors(); instead
                errors = [...errors, ...fieldErrors];
            }

            expectedIndex++;
        }

        return errors;
    }

    _validateFieldSpecData_extensible(fieldValue)
    {
        let errors = [];

        if (typeof fieldValue !== 'boolean') {
            errors.push([ParseSpecException.CODE_INVALID_SPEC_DATA, "Boolean expected as value of 'extensible' field, but " + (typeof fieldValue) + " given."]);
            return errors;
        }

        this._extensible = fieldValue;

        return errors;
    }

    _validateFieldSpecData_extensionFields(fieldValue)
    {
        let errors = [];

        // @todo IMPORTANT check if $this->_extensible could have not been initialized yet
        if (!this._extensible) {
            errors.push([ParseSpecException.CODE_EXTENSIBLE_EXPECTED, "Field 'extensionFields' can only be used when 'extensible' is true."]);
        }

        try {
            this._extensionFieldsSpec = SpecBuilder.getInstance().build(fieldValue, this._library);
        } catch (ex) {

            if (!(ex instanceof ParseSpecException)) {
                throw new Error('Unexpected exception.');
            }

            errors = ex._errors; // @todo ->getErrors();
        }

        return errors;
    }

    _validateFieldSpecData_requiredFields(fieldValue)
    {
        let errors = [];

        if (!Array.isArray(fieldValue)) {
            errors.push([ParseSpecException.CODE_ARRAY_EXPECTED, "Array expected as value of 'requiredFields' field, but " + (typeof fieldValue) + " given."]);
            return errors;
        }

        let expectedIndex = 0;
        for (let index = 0; index < fieldValue.length; index++) {
            let fieldName = fieldValue[index];
            if (index !== expectedIndex) {
                errors.push([ParseSpecException.CODE_INVALID_SPEC_DATA, "Index in 'requiredFields' array must be integer and consecutive."]);
            }

            if (typeof fieldName !== 'string') {
                errors.push([ParseSpecException.CODE_STRING_EXPECTED, "Required field name in object spec should be a string, but " + (typeof fieldValue) + " given."]);
                continue;
            }

            // Note that the required fields could not be part of the 'fields' meta field, since they can be extension fields without specification
            // @todo check if required fields are in 'fields' in case the object is not extensible
            this._requiredFields.push(fieldName);

            expectedIndex++;
        }

        return errors;
    }

    parse(value)
    {
        let parsedValue = [];

        let errors = [];

        /* to be deleted */
        // errors.push([ParseSpecException.CODE_MISSING_REQUIRED_FIELD, `Missing required field(s) xxxx in object spec.`]);
        // throw new ParseSpecException('Could not parse the value', ParseSpecException.CODE_MULTIPLE_PARSER_ERROR, errors);
        /* /to be deleted */

        if (typeof value !== 'object' || Array.isArray(value)) {
            errors.push([ParseSpecException.CODE_ARRAY_EXPECTED, "Expected object as value for object spec, but " + (typeof value) + " given."]);
            throw new ParseSpecException('Could not parse the value', ParseSpecException.CODE_MULTIPLE_PARSER_ERROR, errors);
        }

        let specFieldKeys = Object.keys(this._fieldSpecs);

        // Check for required fields
        let missingRequiredFields = array_diff(this._requiredFields, Object.keys(value));
        if (missingRequiredFields.length > 0) {
            let missingRequiredMetakeysStr = '\'' + missingRequiredFields.join('\', \'') + '\'';
            errors.push([ParseSpecException.CODE_MISSING_REQUIRED_FIELD, `Missing required field(s) ${missingRequiredMetakeysStr} in object spec.`]);
            throw new ParseSpecException('Could not parse the value', ParseSpecException.CODE_MULTIPLE_PARSER_ERROR, errors);
        }

        // Check that values follow the field specs
        for (let fieldKey in value) if (value.hasOwnProperty(fieldKey)) {
            let fieldValue = value[fieldKey];

            let fieldHasSpec = specFieldKeys.indexOf(fieldKey) >= 0;

            if (!fieldHasSpec && !this._extensible) {
                errors.push([ParseSpecException.CODE_UNEXPECTED_FIELDS, "Unexpected field '$fieldKey' in value for object spec."]);
                throw new ParseSpecException('Could not parse the value', ParseSpecException.CODE_MULTIPLE_PARSER_ERROR, errors);
            }
            let fieldSpec;
            if (fieldHasSpec) {
                fieldSpec = this._fieldSpecs[fieldKey];
            } else if (this._extensionFieldsSpec !== null) {
                fieldSpec = this._extensionFieldsSpec;
            } else {
                fieldSpec = this._getAnySpec();
            }

            parsedValue[fieldKey] = fieldSpec.parse(fieldValue);
        }

        return new Entity(this, parsedValue);
    }
}


export default ObjectSpec;
