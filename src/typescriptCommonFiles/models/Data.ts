export interface PropertiesValue {
    [propertyName: string]: any;
}

export interface UnitElementData
{
    properties: PropertiesValue;
    tableCells?: PropertiesValue[][];
}

export interface UnitPageData {
    properties: PropertiesValue;
    elements: {
        [elementID: string]: UnitElementData;
    };
}

export interface UnitData
{
    pages: {
        [pageID: string]: UnitPageData;
    };
    properties: PropertiesValue;
}
