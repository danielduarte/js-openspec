//use OpenSpec\ParseSpecException;


class BooleanSpec //extends TypeSpec
{
   /* public function getTypeName(): string
    {
        return 'boolean';
    }

    public function getRequiredFields(): array
    {
        return ['type'];
    }

    public function getOptionalFields(): array
    {
        return [];
    }
*/
    parse(value)
    {
        let errors = [];

        if (typeof value !== 'boolean') {
            errors.push([ParseSpecException.CODE_BOOLEAN_EXPECTED, "Expected boolean value for 'boolean' type spec, but " + (typeof value) + " given."]);
            throw new ParseSpecException('Could not parse the value', ParseSpecException.CODE_MULTIPLE_PARSER_ERROR, errors);
        }

        return value;
    }
}


export default BooleanSpec;
