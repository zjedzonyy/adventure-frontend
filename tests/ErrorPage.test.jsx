import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorPage } from "../src/components/errors/index";
import { renderWithAuthContext } from "./helper";

const mockShowToast = vi.fn();
const mockAuthContext = {
  showToast: mockShowToast,
};

describe("ErrorPage", () => {
  beforeEach(() => {
    // Reset the mock before each test
    vi.clearAllMocks();
  });

  it("renders view based on props", async () => {
    renderWithAuthContext(
      <ErrorPage errorType="403" title="Fake Title" message="Fake message" />,
      mockAuthContext
    );

    const icon = screen.getByTestId("test-icon");

    expect(screen.getByText("403")).toBeInTheDocument();
    expect(screen.getByText("Fake Title")).toBeInTheDocument();
    expect(screen.getByText("Fake message")).toBeInTheDocument();
    expect(icon).toHaveClass("from-yellow-600 to-amber-600");
  });

  it("renders dedicated sections", async () => {
    renderWithAuthContext(
      <ErrorPage errorType="network" title="Fake Title" message="Fake message" />,
      mockAuthContext
    );

    expect(
      screen.getByText("Please check your internet connection and try again.")
    ).toBeInTheDocument();
  });

  it("calls functions", async () => {
    const onGoHome = vi.fn();
    const onGoBack = vi.fn();
    const onRefresh = vi.fn();

    renderWithAuthContext(
      <ErrorPage onGoHome={onGoHome} onGoBack={onGoBack} onRefresh={onRefresh} />,
      mockAuthContext
    );
    const home = screen.getByText("Go Home");
    const back = screen.getByText("Go Back");
    const refresh = screen.getByText("Refresh");
    const toast = screen.getByText("help center");

    await userEvent.click(home);
    await userEvent.click(back);
    await userEvent.click(refresh);
    await userEvent.click(toast);

    expect(onGoHome).toHaveBeenCalled();
    expect(onGoBack).toHaveBeenCalled();
    expect(onRefresh).toHaveBeenCalled();
    expect(mockShowToast).toHaveBeenCalled();
  });
});
