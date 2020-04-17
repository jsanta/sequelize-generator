import {
    getWorkspace
} from '@schematics/angular/utility/config';
import {
    buildDefaultPath
} from '@schematics/angular/utility/project';
import {
    parseName
} from '@schematics/angular/utility/parse-name';
import {
    Tree,
    Rule,
    SchematicContext,
    apply,
    url,
    noop,
    filter,
    template,
    move,
    mergeWith,
    MergeStrategy
} from '@angular-devkit/schematics';
import {
    normalize
} from 'path';
import {
    strings
} from '@angular-devkit/core';

// Ref.: https://medium.com/rocket-fuel/angular-schematics-simple-schematic-76be2aa72850
export function setupOptions(host: Tree, options: any): Tree {
    const workspace = getWorkspace(host);
    if (!options.project) {
        options.project = Object.keys(workspace.projects)[0];
    }
    const project = workspace.projects[options.project];

    if (options.path === undefined) {
        options.path = buildDefaultPath(project);
    }

    const parsedPath = parseName(options.path, options.name);
    options.name = parsedPath.name;
    options.path = parsedPath.path;
    return host;
}


export function sequelizeGenerator(options: any): Rule {
    return (tree: Tree, _context: SchematicContext) => {
        setupOptions(tree, options);

        const movePath = (options.flat) ?
            normalize(options.path) :
            normalize(options.path + '/' + strings.dasherize(options.name));

        const templateSource = apply(url('./files'), [
            options.spec ? noop() : filter(path => !path.endsWith('.spec.ts')),
            template({
                ...options,
                ...strings,
            }),
            move(movePath),
        ]);

        const rule = mergeWith(templateSource, MergeStrategy.Default);
        return rule(tree, _context);
    };
}