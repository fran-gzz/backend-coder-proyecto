
export const typeErrorMessage = (properties, context) => {
    const rulesByContext = {
        login: {
            email: { type: 'string', label: 'Email' },
            password: { type: 'string', label: 'Contraseña' },
        },
        register: {
            first_name: { type: 'string', label: 'Nombre' },
            last_name: { type: 'string', label: 'Apellido' },
            email: { type: 'string', label: 'Email' },
            age: { type: 'number', label: 'Edad' },
            password: { type: 'string', label: 'Contraseña' },
        },
        product: {
            title: { type: 'string', label: 'Titulo'},
            description: { type: 'string', label: 'Descripcion'},
            price: { type: 'number', label: 'Precio'},
            thumbnail: { type: 'string', label: 'Imagen'},
            stock: { type: 'number', label: 'Stock'},
        }
    };

    const invalidProps = [];
    const rulesToUse = rulesByContext[context];

    // Identificar las propiedades inválidas y agregarlas al array 'invalidProps'
    for (const prop in rulesToUse) {
        if (!properties[prop] || typeof properties[prop] !== rulesToUse[prop].type) {
            invalidProps.push(rulesToUse[prop].label);
        }
    }
    // Generar el mensaje de error solo para las propiedades inválidas
    if (invalidProps.length > 0) {
        return `La(s) propiedad(es): ${invalidProps.map(prop => `'${prop}'`).join(', ')} son incorrectas o están incompletas.`;
    } else {
        return `Error en una o más propiedades.`;
    }
};
/*
export const typeErrorMessage = ( properties ) => {
    const propertyRules = {
        first_name: { type: 'string', label: 'Nombre' },
        last_name: { type: 'string', label: 'Apellido' },
        email: { type: 'string', label: 'Email' },
        age: { type: 'number', label: 'Edad' },
        password: { type: 'string', label: 'Contraseña' },
    }

    const invalidProps = [];

    for(const prop in propertyRules ){
        if (!properties[prop] || typeof properties[prop] !== propertyRules[prop].type) {
            invalidProps.push(prop);
        }
    }

    // Generar el mensaje de error solo para las propiedades inválidas
    switch (invalidProps.length) {
        case 1:
            return `La propiedad '${propertyRules[invalidProps[0]].label}' es incorrecta o está incompleta.`;
        case 2:
            return `Las propiedades '${propertyRules[invalidProps[0]].label}' y '${propertyRules[invalidProps[1]].label}' son incorrectas o están incompletas.`;
        case 3:
            return `Las propiedades '${propertyRules[invalidProps[0]].label}', '${propertyRules[invalidProps[1]].label}' y '${propertyRules[invalidProps[2]].label}' son incorrectas o están incompletas.`;
        case 4:
            return `Las propiedades '${propertyRules[invalidProps[0]].label}', '${propertyRules[invalidProps[1]].label}', '${propertyRules[invalidProps[2]].label}' y '${propertyRules[invalidProps[3]].label}' son incorrectas o están incompletas.`;
        case 5:
            return `Todas las propiedades son incorrectas o están incompletas.`;
        default:
            return `Error en una o más propiedades.`;
    }
}
*/