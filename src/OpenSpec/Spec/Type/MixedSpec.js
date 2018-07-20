import SpecBuilder from "../../SpecBuilder";
import TypeSpec           from "./TypeSpec";
import ParseSpecException from "../../ParseSpecException";


class MixedSpec extends TypeSpec
{
    _initValues() {
        this._optionsSpec = [];
    }

    getTypeName()
    {
        return 'mixed';
    }

    getRequiredFields()
    {
        return ['type', 'options'];
    }

    getOptionalFields()
    {
        return [];
    }

    _validateFieldSpecData_options(fieldValue)
    {
        let errors = [];

        if (!Array.isArray(fieldValue)) {
            errors.push([ParseSpecException.CODE_ARRAY_EXPECTED, "Array expected as value of 'options' field, but " + (typeof fieldValue) + " given."]);
            return errors;
        }

        let expectedIndex = 0;
        for (let index = 0; index < fieldValue.length; index++) {
            let optionSpecData = fieldValue[index];
            if (index !== expectedIndex) {
                errors.push([ParseSpecException.CODE_INVALID_SPEC_DATA, "Index in 'options' array must be integer and consecutive."]);
            }

            try {
                this._optionsSpec.push(SpecBuilder.getInstance().build(optionSpecData, this._library));
            } catch (ex) {

                if (!(ex instanceof ParseSpecException)) {
                    throw new Error('Unexpected exception.');
                }

                let optionErrors = ex._errors; // @todo use ->getErrors();
                errors = [...errors, ...optionErrors];
            }

            expectedIndex++;
        }

        return errors;
    }

    parse(value)
    {
        let errors = [];

        for (let i = 0; i < this._optionsSpec.length; i++) {
            let optionSpec = this._optionsSpec[i];
            try {
                return optionSpec.parse(value);
            } catch (ex) {

                if (!(ex instanceof ParseSpecException)) {
                    throw new Error('Unexpected exception.');
                }

                // Continue with next option
            }
        }

        errors.push([ParseSpecException.CODE_INVALID_SPEC_DATA, "Value for 'mixed' spec does not follow any of the options."]);
        throw new ParseSpecException('Could not parse the value', ParseSpecException.CODE_MULTIPLE_PARSER_ERROR, errors);
    }
}


export default MixedSpec;
