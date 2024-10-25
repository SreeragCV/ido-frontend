const Render = ({ children, condition }) => {
  return <>{condition ? children : null}</>;
};

const Else = ({ children, condition, someThingElse }) => {
  return <>{!condition ? someThingElse : children}</>;
};

Render.Else = Else;
export { Render };
