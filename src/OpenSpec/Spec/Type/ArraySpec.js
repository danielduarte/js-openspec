//use OpenSpec\SpecBuilder;
import TypeSpec           from "./TypeSpec";
import ParseSpecException from "../../ParseSpecException";

class ArraySpec extends TypeSpec
{
    _initValues() {
        this._itemsSpec = null;
    }

    getTypeName()
    {
        return 'array';
    }

    getRequiredFields()
    {
        return ['type'];
    }

    getOptionalFields()
    {
        return ['items'];
    }
/*

    protected function _validateFieldSpecData_items($fieldValue): array
    {
        $errors = [];

        try {
            $this->_itemsSpec = SpecBuilder::getInstance()->build($fieldValue, $this->_library);
        } catch (ParseSpecException $ex) {
            $errors = $ex->getErrors();
        }

        return $errors;
    }
*/
    parse(value)
    {
        let parsedValue = [];

        let errors = [];

        if (!Array.isArray(value)) {
            errors.push([ParseSpecException.CODE_ARRAY_EXPECTED, "Array expected as value of 'array' spec, but " + (typeof value) + " given."]);
            throw new ParseSpecException('Could not parse the value', ParseSpecException.CODE_MULTIPLE_PARSER_ERROR, errors);
        }

        let itemSpec;
        if (this._itemsSpec !== null) {
            itemSpec = this._itemsSpec;
        } else {
            itemSpec = this._getAnySpec();
        }

        let expectedIndex = 0;
        for (let index = 0; index < value.length; index++) {
            let item = value[index];
            if (expectedIndex !== index) {
                errors.push([ParseSpecException.CODE_INVALID_SPEC_DATA, "Index in value of 'array' spec expected to be integer and consecutive."]);
                throw new ParseSpecException('Could not parse the value', ParseSpecException.CODE_MULTIPLE_PARSER_ERROR, errors);
            }

            try {
                parsedValue.push(itemSpec.parse(item));
            } catch (ex) {

                if (!(ex instanceof ParseSpecException)) {
                    throw new Error('Unexpected exception.');
                }

                let itemErrors = ex._errors; // @todo use getErrors();

                let itemErrorsMessages = itemErrors.map((error) => { return error[1]; });
                let msg = '- ' + itemErrorsMessages.join("\n- ");
                errors.push([ParseSpecException.CODE_INVALID_SPEC_DATA, "Array item with index $index does not follow the spec.\n" + msg]);
                throw new ParseSpecException('Could not parse the value', ParseSpecException.CODE_MULTIPLE_PARSER_ERROR, errors);
            }

            expectedIndex++;
        }

        // No errors
        return parsedValue;
    }
}


export default ArraySpec;
