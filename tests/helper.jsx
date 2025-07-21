import { AuthContext } from "../src/components/auth";
import { render } from "@testing-library/react";

export const renderWithAuthContext = (ui, value) =>
  render(<AuthContext.Provider value={value}>{ui}</AuthContext.Provider>);
