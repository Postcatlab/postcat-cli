# EO CLI

## Installion

```
npm install -g @eoapi/cli
```

Now, you can use `eo xxx` command to generate、upload plugin of eoapi.

## Generate

```
eo generate <plugin name>
# or
eo g <plugin name>
```

The commad will generate a folder includes base config files, let you could create any features.

## Upload

```
eo upload <plugin name>
```

If your plugin name format is `eo-module-foo`, of course you can input `eo upload eo-module-foo`, or you can just input `eo upload foo`, the cli will trying to search the plugin that name is `eo-module-` prefix.

If your plugin name is other style that like `foo-app`, you need to add `-f` option.
`eo upload foo-app -f`
