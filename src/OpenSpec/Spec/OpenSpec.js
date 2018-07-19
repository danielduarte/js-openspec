/*use OpenSpec\SpecBuilder;
use OpenSpec\ParseSpecException;
*/
import SpecBuilder from "../SpecBuilder";
import SpecLibrary from '../SpecLibrary';
import ParseSpecException from "../ParseSpecException";


class OpenSpec// extends Spec
{
    constructor (specData)
    {
        this._library = new SpecLibrary();

        let errors = this._validateSpecData(specData);
        if (errors.length > 0) {
            throw new ParseSpecException('Invalid spec data.', ParseSpecException.CODE_MULTIPLE_PARSER_ERROR, errors);
        }

        // @todo Improve performance reusing specs already created in previous validation
        this._openspecVersion = specData.openspec;
        this._name            = specData.name;
        this._version         = specData.hasOwnProperty('version') ? specData.version : null;
        this._spec            = SpecBuilder.getInstance().build(specData.spec, this._library);

        // @todo make sure this registration should happen
        this._library.registerSpec(this._name, this);

        if (specData.hasOwnProperty('definitions')) {
            this._parseDefinitions(specData.definitions);
        }

        // @todo check here the missing references (refs to definitions that are not specified)*/
    }

    _validateSpecData(specData)
    {
        // Validate metamodel
        try {
            SpecBuilder.getInstance().build({
                type: 'object',
                fields: {
                    openspec:    { type: 'string' },
                    name:        { type: 'string' },
                    version:     { type: 'string' },
                    spec:        { type: 'object', extensible: true },
                    definitions: { type: 'object', extensible: true },
                },
                requiredFields:  ['openspec', 'name', 'spec']
            }, this._library).parse(specData);
        } catch (err) {

            if (!(err instanceof ParseSpecException)) {
                throw new Error('Unexpected exception.');
            }

            return err._errors; // getErrors(); // @todo check why the method does not work
        }

        return [];
    }
/*
    protected function _parseDefinitions($definitionsData): void
    {
        foreach ($definitionsData as $defName => $defSpec) {
            $this->_library->registerSpecFromData($defName, $defSpec);
        }
    }

    public function parse($userSpecData)
    {
        return $this->_spec->parse($userSpecData);
    }

    public function getOpenspecVersion()
    {
        return $this->_openspecVersion;
    }

    public function getName()
    {
        return $this->_name;
    }

    public function getVersion()
    {
        return $this->_version;
    }

    public function getSpec()
    {
        return $this->_spec;
    }*/
}


export default OpenSpec;
