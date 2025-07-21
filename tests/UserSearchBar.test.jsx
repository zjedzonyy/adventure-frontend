import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserSearchBar } from "../src/components/common/index";

describe("UserSerachBar", () => {
  beforeEach(() => {
    // Reset the mock before each test
    vi.clearAllMocks();
  });

  it("renders search bar", async () => {
    render(<UserSearchBar />);

    expect(screen.getByTestId("user-search-bar")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search users...")).toBeInTheDocument();
  });

  it("opens dropdown on input focus and closes on clicking outside", async () => {
    // eslint-disable-next-line no-undef
    const mockFetch = (global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            data: [
              { id: 1, username: "testuser1" },
              { id: 2, username: "testuser2" },
            ],
          }),
      })
    ));

    render(
      <>
        <UserSearchBar />
        <div data-testid="outside-element"></div>
      </>
    );

    const input = screen.getByPlaceholderText("Search users...");
    input.focus();

    await userEvent.type(input, "qwe");

    await waitFor(() => {
      // console.log(screen.debug());
      expect(screen.getByTestId("user-search-dropdown")).toBeInTheDocument();
    });

    const outsideElement = screen.getByTestId("outside-element");
    await userEvent.click(outsideElement);
    await waitFor(() => {
      expect(screen.queryByTestId("user-search-dropdown")).not.toBeInTheDocument();
    });
  });

  it("clear users search results on input clear", async () => {
    // Mock fetch response
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: [{ id: 1, username: "testuser" }] }),
    });

    render(<UserSearchBar />);

    const input = screen.getByPlaceholderText("Search users...");
    await userEvent.type(input, "testuser");

    await waitFor(() => {
      expect(screen.getByTestId("user-search-dropdown")).toBeInTheDocument();
      expect(screen.getByText("testuser")).toBeInTheDocument();
    });

    // Clear input
    await userEvent.clear(input);
    expect(input.value).toBe("");

    // Check if dropdown is closed and results are cleared
    await waitFor(() => {
      expect(screen.queryByTestId("user-search-dropdown")).not.toBeInTheDocument();
    });
  });

  it("renders user not find message when no users found", async () => {
    // Mock fetch response for no users found
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: [] }),
    });
    render(<UserSearchBar />);

    const input = screen.getByPlaceholderText("Search users...");
    await userEvent.type(input, "nonexistentuser");

    await waitFor(() => {
      expect(screen.getByTestId("user-search-dropdown")).toBeInTheDocument();
      expect(screen.getByText("Couldn't find anyone")).toBeInTheDocument();
    });
  });
});
