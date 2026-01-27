const { Converter, ReflectionKind, DeclarationReflection } = require('typedoc');

exports.load = (app) => {
  app.converter.on(Converter.EVENT_RESOLVE_BEGIN, (context) => {
    mergeModules(context.project);
  });
};

const mergeModules = (project) => {
  const reflections = Object.values(project.reflections);
  const modules = reflections.filter((ref) => isModule(ref));
  modules.sort((a, b) => segmentCount(a.name) - segmentCount(b.name));
  const moduleMap = new Map();
  for (const mod of modules) {
    const parts = mod.name.split('.').filter(Boolean);
    const parent = ensureModuleChain(project, parts.slice(0, -1));
    const leafName = parts.length ? parts[parts.length - 1] : mod.name;
    const key = parts.length ? parts.join('.') : mod.name;
    const target = moduleMap.get(key);
    if (!target) {
      moduleMap.set(key, mod);
      moveReflection(project, mod, parent, leafName);
    } else if (target !== mod) {
      moveChildren(target, mod);
      removeReflection(project, mod);
    }
  }
};

const isModule = (reflection) => {
  return (
    (reflection.kind & ReflectionKind.Module) !== 0 ||
    (reflection.kind & ReflectionKind.Namespace) !== 0
  );
};

const segmentCount = (name) => {
  if (!name) return 0;
  return name.split('.').filter(Boolean).length;
};

const ensureModuleChain = (project, parts) => {
  let parent = project;
  for (const part of parts) {
    parent.children = parent.children || [];
    let child = parent.children.find(
      (ref) => isModule(ref) && ref.name === part
    );
    if (!child) {
      child = new DeclarationReflection(part, ReflectionKind.Module, parent);
      child.children = [];
      project.reflections[child.id] = child;
      parent.children.push(child);
    }
    parent = child;
  }
  return parent;
};

const moveReflection = (project, reflection, newParent, newName) => {
  if (!newParent) return;
  const oldParent = reflection.parent;
  if (oldParent && oldParent.children) {
    const idx = oldParent.children.indexOf(reflection);
    if (idx >= 0) {
      oldParent.children.splice(idx, 1);
    }
  }
  newParent.children = newParent.children || [];
  if (!newParent.children.includes(reflection)) {
    newParent.children.push(reflection);
  }
  reflection.parent = newParent;
  reflection.name = newName;
};

const moveChildren = (target, source) => {
  if (!source.children || !source.children.length) {
    return;
  }
  target.children = target.children || [];
  for (const child of source.children) {
    child.parent = target;
    target.children.push(child);
  }
  source.children.length = 0;
};

const removeReflection = (project, reflection) => {
  if (reflection.parent && reflection.parent.children) {
    const idx = reflection.parent.children.indexOf(reflection);
    if (idx >= 0) {
      reflection.parent.children.splice(idx, 1);
    }
  }
  project.removeReflection(reflection, true);
  delete project.reflections[reflection.id];
};
