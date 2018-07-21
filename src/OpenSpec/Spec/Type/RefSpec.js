import TypeSpec           from "./TypeSpec";
import ParseSpecException from "../../ParseSpecException";
import SpecLibrary        from "../../SpecLibrary";


class RefSpec extends TypeSpec
{
    _initValues() {
        this._specName = null;
    }

    getTypeName()
    {
        return 'ref';
    }

    getRequiredFields()
    {
        return ['type', 'spec'];
    }

    getOptionalFields()
    {
        return [];
    }

    _validateFieldSpecData_spec(fieldValue)
    {
        let errors = [];

        if (typeof fieldValue !== 'string') {
            errors.push([ParseSpecException.CODE_STRING_EXPECTED, "String expected as value of 'spec' field of reference, but " + (typeof fieldValue) + " given."]);
            return errors;
        }

        this._specName = fieldValue;

        // @todo consider if it will be needed to check the existence of the referenced spec.

        return errors;
    }

    parse(value)
    {
        let errors = [];

        if (!this._library.hasSpec(this._specName)) {
            errors.push([ParseSpecException.CODE_UNDEFINED_NAMED_SPEC, "Undefined named spec '" + this._specName + "'."]);
            throw new ParseSpecException('Could not parse the value', ParseSpecException.CODE_MULTIPLE_PARSER_ERROR, errors);
        }

        return this._library.getSpec(this._specName).parse(value);
    }
}


export default RefSpec;
