const serverOnlyModule = "data:text/javascript,export default undefined";

export function resolve(specifier, context, nextResolve) {
  if (specifier === "server-only") {
    return {
      shortCircuit: true,
      url: serverOnlyModule,
    };
  }

  return nextResolve(specifier, context);
}
