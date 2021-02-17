// To parse this data:
//
//   import { Convert, ConfigJSON, Lightning, Layouts, KeymapOption, Matrix } from "./file";
//
//   const configJSON = Convert.toConfigJSON(json);
//   const lightning = Convert.toLightning(json);
//   const layoutLabels = Convert.toLayoutLabels(json);
//   const layouts = Convert.toLayouts(json);
//   const keymapOption = Convert.toKeymapOption(json);
//   const matrix = Convert.toMatrix(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface ConfigJSON {
    layouts:   Layouts;
    lighting:  Lightning | string;
    matrix:    Matrix;
    name:      string;
    productId: string;
    vendorId:  string;
}

export interface Layouts {
    keymap:  Array<Array<KeymapOption | string>>;
    labels?: Array<string[] | string>;
}

export interface KeymapOption {
    c?:  string;
    d?:  boolean;
    h?:  number;
    h2?: number;
    w?:  number;
    w2?: number;
    x?:  number;
    x2?: number;
}

export interface Lightning {
    extends: string;
}

export interface Matrix {
    cols: number;
    rows: number;
}

// Converts JSON types to/from your types
// and asserts the results at runtime
export class Convert {
    public static toConfigJSON(json: any): ConfigJSON {
        return cast(json, r("ConfigJSON"));
    }

    public static configJSONToJson(value: ConfigJSON): any {
        return uncast(value, r("ConfigJSON"));
    }

    public static toLightning(json: any): Lightning {
        return cast(json, r("Lightning"));
    }

    public static lightningToJson(value: Lightning): any {
        return uncast(value, r("Lightning"));
    }

    public static toLayoutLabels(json: any): Array<string[] | string> {
        return cast(json, a(u(a(""), "")));
    }

    public static layoutLabelsToJson(value: Array<string[] | string>): any {
        return uncast(value, a(u(a(""), "")));
    }

    public static toLayouts(json: any): Layouts {
        return cast(json, r("Layouts"));
    }

    public static layoutsToJson(value: Layouts): any {
        return uncast(value, r("Layouts"));
    }

    public static toKeymapOption(json: any): KeymapOption {
        return cast(json, r("KeymapOption"));
    }

    public static keymapOptionToJson(value: KeymapOption): any {
        return uncast(value, r("KeymapOption"));
    }

    public static toMatrix(json: any): Matrix {
        return cast(json, r("Matrix"));
    }

    public static matrixToJson(value: Matrix): any {
        return uncast(value, r("Matrix"));
    }
}

function invalidValue(typ: any, val: any, key: any = ''): never {
    if (key) {
        throw Error(`Invalid value for key "${key}". Expected type ${JSON.stringify(typ)} but got ${JSON.stringify(val)}`);
    }
    throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`, );
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases, val);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue("array", val);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue("Date", val);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue("object", val);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, prop.key);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val);
    }
    if (typ === false) return invalidValue(typ, val);
    while (typeof typ === "object" && typ.ref !== undefined) {
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "ConfigJSON": o([
        { json: "layouts", js: "layouts", typ: r("Layouts") },
        { json: "lighting", js: "lighting", typ: u(r("Lightning"), "") },
        { json: "matrix", js: "matrix", typ: r("Matrix") },
        { json: "name", js: "name", typ: "" },
        { json: "productId", js: "productId", typ: "" },
        { json: "vendorId", js: "vendorId", typ: "" },
    ], "any"),
    "Layouts": o([
        { json: "keymap", js: "keymap", typ: a(a(u(r("KeymapOption"), ""))) },
        { json: "labels", js: "labels", typ: u(undefined, a(u(a(""), ""))) },
    ], "any"),
    "KeymapOption": o([
        { json: "c", js: "c", typ: u(undefined, "") },
        { json: "d", js: "d", typ: u(undefined, true) },
        { json: "h", js: "h", typ: u(undefined, 3.14) },
        { json: "h2", js: "h2", typ: u(undefined, 3.14) },
        { json: "w", js: "w", typ: u(undefined, 3.14) },
        { json: "w2", js: "w2", typ: u(undefined, 3.14) },
        { json: "x", js: "x", typ: u(undefined, 3.14) },
        { json: "x2", js: "x2", typ: u(undefined, 3.14) },
    ], "any"),
    "Lightning": o([
        { json: "extends", js: "extends", typ: "" },
    ], "any"),
    "Matrix": o([
        { json: "cols", js: "cols", typ: 3.14 },
        { json: "rows", js: "rows", typ: 3.14 },
    ], "any"),
};
