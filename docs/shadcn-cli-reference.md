# shadcn CLI Reference

Use the shadcn CLI to add components to your project.

## init

Use the `init` command to initialize configuration and dependencies for a new project.

The `init` command installs dependencies, adds the `cn` util and configures CSS variables for the project.

```bash
pnpm dlx shadcn@latest init
```

### Options

```
Usage: shadcn init [options] [components...]

initialize your project and install dependencies

Arguments:
 components         name, url or local path to component

Options:
 -t, --template <template>      the template to use. (next, next-monorepo)
 -b, --base-color <base-color>  the base color to use. (neutral, gray, zinc, stone, slate)
 -y, --yes                      skip confirmation prompt. (default: true)
 -f, --force                    force overwrite of existing configuration. (default: false)
 -c, --cwd <cwd>                the working directory. defaults to the current directory.
 -s, --silent                   mute output. (default: false)
 --src-dir                      use the src directory when creating a new project. (default: false)
 --no-src-dir                   do not use the src directory when creating a new project.
 --css-variables                use css variables for theming. (default: true)
 --no-css-variables             do not use css variables for theming.
 -h, --help                     display help for command
```

## add

Use the `add` command to add components and dependencies to your project.

```bash
pnpm dlx shadcn@latest add [component]
```

### Options

```
Usage: shadcn add [options] [components...]

add a component to your project

Arguments:
 components         name, url or local path to component

Options:
 -y, --yes           skip confirmation prompt. (default: false)
 -o, --overwrite     overwrite existing files. (default: false)
 -c, --cwd <cwd>     the working directory. defaults to the current directory.
 -a, --all           add all available components (default: false)
 -p, --path <path>   the path to add the component to.
 -s, --silent        mute output. (default: false)
 --src-dir           use the src directory when creating a new project. (default: false)
 --no-src-dir        do not use the src directory when creating a new project.
 --css-variables     use css variables for theming. (default: true)
 --no-css-variables  do not use css variables for theming.
 -h, --help          display help for command
```

## build

Use the `build` command to generate the registry JSON files.

```bash
pnpm dlx shadcn@latest build
```

This command reads the `registry.json` file and generates the registry JSON files in the `public/r` directory.

### Options

```
Usage: shadcn build [options] [registry]

build components for a shadcn registry

Arguments:
 registry             path to registry.json file (default: "./registry.json")

Options:
 -o, --output <path>  destination directory for json files (default: "./public/r")
 -c, --cwd <cwd>      the working directory. defaults to the current directory.
 -h, --help           display help for command
```

To customize the output directory, use the `--output` option.

```bash
pnpm dlx shadcn@latest build --output ./public/registry
```

## Best Practices

1. **Always use the latest version**: Use `@latest` to ensure you're using the most recent version of the CLI
2. **Project initialization**: Run `init` before adding any components to set up the proper configuration
3. **Component management**: Use `add` to install individual components or `add --all` for all components
4. **Custom registries**: Use the `build` command when creating your own component registry

## Common Commands

```bash
# Initialize a new project
pnpm dlx shadcn@latest init

# Add a specific component
pnpm dlx shadcn@latest add button

# Add multiple components
pnpm dlx shadcn@latest add button card dialog

# Add all available components
pnpm dlx shadcn@latest add --all

# Force overwrite existing files
pnpm dlx shadcn@latest add button --overwrite

# Use with custom path
pnpm dlx shadcn@latest add button --path ./src/components/custom
```

## Integration Notes

- The CLI automatically detects your project structure and framework
- Components are added with proper TypeScript types and imports
- CSS variables are configured automatically for theming
- The CLI respects your existing project configuration
