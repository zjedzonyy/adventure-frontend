import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { LoadingWrapper } from "../src/components/common/index";

describe("LoadingWrapper", () => {
  it("renders spinner if loading=true and delay=0", async () => {
    render(
      <LoadingWrapper loading={true} delay={300} loadingText="Loading icon">
        <div>Hidden content</div>
      </LoadingWrapper>
    );
    await waitFor(() => {
      expect(screen.getByText("Loading icon")).toBeInTheDocument();
      expect(screen.getByTestId("spinner")).toBeInTheDocument();
      expect(screen.getByTestId("spinner")).toHaveClass(
        "min-h-screen",
        "flex",
        "items-center",
        "justify-center"
      );
      expect(screen.queryByText("Hidden content")).not.toBeInTheDocument();
    });
  });

  it("renders children if loading=false", () => {
    render(
      <LoadingWrapper loading={false}>
        <div>Loaded content</div>
      </LoadingWrapper>
    );
    expect(screen.getByText("Loaded content")).toBeInTheDocument();
  });

  it("renders spinner in page=false mode", async () => {
    render(
      <LoadingWrapper loading={true} page={false} delay={300} loadingText="Loading...">
        <div>Hidden content</div>
      </LoadingWrapper>
    );
    await waitFor(() => {
      expect(screen.getByTestId("spinner")).toBeInTheDocument();
      expect(screen.getByTestId("spinner")).toHaveClass("flex", "items-center", "justify-center");
      expect(screen.queryByText("Hidden content")).not.toBeInTheDocument();
    });
  });

  it("spinner does not redner if delay is not reached", async () => {
    render(
      <LoadingWrapper loading={true} delay={500} loadingText="Loading...">
        <div>Hidden content</div>
      </LoadingWrapper>
    );
    expect(screen.queryByTestId("spinner")).not.toBeInTheDocument();
    await new Promise(resolve => setTimeout(resolve, 300)); // Wait less than delay
    expect(screen.queryByTestId("spinner")).not.toBeInTheDocument();
    waitFor(() => {
      expect(screen.queryByTestId("spinner")).toBeInTheDocument();
    });
  });
});
