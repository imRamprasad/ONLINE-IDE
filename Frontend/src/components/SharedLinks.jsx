import { useEffect, useState } from "react";
import { apiFetch } from "../utils/apifetch";
import {
  SESSION_STORAGE_SHARELINKS_KEY,
  LOCAL_STORAGE_TOKEN_KEY,
  LOCAL_STORAGE_USERNAME_KEY,
  LOCAL_STORAGE_LOGIN_KEY,
  BACKEND_API_URL,
  TEMP_SHARE_API_URL,
} from "../utils/constants";
import { Link } from "react-router-dom";
import { CgTrash } from "react-icons/cg";
import { HiRefresh } from "react-icons/hi";
import { FiClipboard, FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { MdDone } from "react-icons/md";
import Swal from "sweetalert2/dist/sweetalert2.js";

const SharedLinks = () => {
  const [sharedLinks, setSharedLinks] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [buttonStates, setButtonStates] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getItemsPerPage = () => {
    const width = window.innerWidth;
    if (width >= 1024) return 8;
    if (width >= 768) return 6;
    if (width >= 640) return 4;
    return 8;
  };

  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage());

  const baseUrl = window.location.origin;

  const fetchSharedLinks = async () => {
    try {
      const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
      const isLogin = localStorage.getItem(LOCAL_STORAGE_LOGIN_KEY);

      if (!token || isLogin !== "true") {
        sessionStorage.removeItem(SESSION_STORAGE_SHARELINKS_KEY);
        return;
      }

      const response = await fetch(`${BACKEND_API_URL}/api/user/sharedLinks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      if (data.sharedLinks && Array.isArray(data.sharedLinks)) {
        const reversedLinks = data.sharedLinks.reverse();
        sessionStorage.setItem(
          SESSION_STORAGE_SHARELINKS_KEY,
          JSON.stringify(reversedLinks)
        );
        setSharedLinks(reversedLinks);
      }
    } catch {
      Swal.fire("Error", "Error fetching shared links.", "error");
    }
  };

  const clearSessionData = (shareId) => {
    sessionStorage.removeItem(SESSION_STORAGE_SHARELINKS_KEY);
    sessionStorage.removeItem(shareId);
    sessionStorage.removeItem(`__${shareId}Code__`);
    sessionStorage.removeItem(`__${shareId}Output__`);
  };

  const handleDelete = async (shareId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this action!",
      icon: "warning",
      reverseButtons: true,
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#da4242",
      cancelButtonText: "Cancel",
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleting...",
          text: "Please wait while your code is being deleted.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        const linkResponse = await apiFetch(
          `${BACKEND_API_URL}/api/user/sharedLink/${shareId}`,
          {
            method: "DELETE",
          }
        );

        const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);

        const fileResponse = await apiFetch(
          `${TEMP_SHARE_API_URL}/file/${shareId}/delete`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!fileResponse.ok && !linkResponse.ok) {
          Swal.close();
          Swal.fire("Error", "There was an issue deleting the link.", "error");
          clearSessionData(shareId);
          return;
        }

        if (fileResponse.ok || linkResponse.ok) {
          Swal.close();
          Swal.fire({
            title: "Deleted!",
            text: "The link has been deleted.",
            icon: "success",
            timer: 3000,
          });

          sessionStorage.removeItem(shareId);
          sessionStorage.removeItem(`__${shareId}Code__`);
          sessionStorage.removeItem(`__${shareId}Output__`);

          setSharedLinks((prevLinks) =>
            prevLinks.filter((link) => link.shareId !== shareId)
          );

          const updatedLinks = sharedLinks.filter(
            (link) => link.shareId !== shareId
          );

          const totalPages = Math.ceil(updatedLinks.length / itemsPerPage);

          if (currentPage > totalPages) {
            setCurrentPage(totalPages);
          } else {
            const currentPageStartIndex = (currentPage - 1) * itemsPerPage;
            if (updatedLinks.length <= currentPageStartIndex) {
              setCurrentPage(Math.max(currentPage - 1, 1));
            }
          }
          clearSessionData(shareId);
        } else {
          Swal.close();
          Swal.fire(
            "Error",
            "Failed to delete link. Refresh and try again.",
            "error"
          );
        }
        clearSessionData(shareId);
      }
    });
  };

  const handleCopy = async (shareId) => {
    try {
      const url = `${baseUrl}/${shareId}`;
      await navigator.clipboard.writeText(url.toString());
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to copy",
        text: "Could not copy the URL to clipboard.",
      });
    }

    if (buttonStates[shareId]?.timeout) {
      clearTimeout(buttonStates[shareId].timeout);
    }

    setButtonStates((prev) => ({
      ...prev,
      [shareId]: { text: "Copied", icon: <MdDone />, timeout: null },
    }));

    const timeout = setTimeout(() => {
      setButtonStates((prev) => ({
        ...prev,
        [shareId]: { text: "Copy", icon: <FiClipboard /> },
      }));
    }, 1500);

    setButtonStates((prev) => ({
      ...prev,
      [shareId]: { ...prev[shareId], timeout },
    }));
  };

  const handleRefresh = () => {
    let refreshTimeout;

    if (refreshTimeout) {
      clearTimeout(refreshTimeout);
    }

    setIsRefreshing(true);
    sessionStorage.removeItem(SESSION_STORAGE_SHARELINKS_KEY);
    fetchSharedLinks();

    refreshTimeout = setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  const handleNext = () => {
    setCurrentPage((prev) =>
      Math.min(prev + 1, Math.ceil(sharedLinks.length / itemsPerPage))
    );
  };

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  useEffect(() => {
    const isLogin = localStorage.getItem(LOCAL_STORAGE_LOGIN_KEY);

    if (isLogin !== "true") {
      sessionStorage.removeItem(SESSION_STORAGE_SHARELINKS_KEY);
      setIsLoggedIn(false);
      return;
    }

    const username = localStorage.getItem(LOCAL_STORAGE_USERNAME_KEY);
    if (username) {
      setIsLoggedIn(isLogin === "true" && !!username);
    } else {
      setIsLoggedIn(false);
    }

    if (!isLoggedIn) {
      return;
    }

    const sharedLink = sessionStorage.getItem(SESSION_STORAGE_SHARELINKS_KEY);
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);

    if (
      (sharedLink === null || sharedLink === "[]") &&
      token &&
      isLogin === "true"
    ) {
      fetchSharedLinks();
    } else {
      setSharedLinks(JSON.parse(sharedLink));
    }

    const handleResize = () => {
      setItemsPerPage(getItemsPerPage());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isLoggedIn]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleLinks = sharedLinks.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex justify-center px-4 sm:px-8 lg:px-12 pb-12 motion-delay-[1400ms] motion-preset-rebound-down">
      <div className="w-full max-w-6xl">
        <div className="mb-6">
          {isLoggedIn && visibleLinks.length > 0 && (
            <div className="flex items-center">
              <h2 className="text-2xl font-bold mb-4 text-left mr-4 ide-section-title">
                Shared Links
              </h2>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                title="refresh"
                className={`ide-icon-button px-2 py-2 mb-4 transform transition duration-200 ease-in-out cursor-pointer focus:outline-none ${
                  isRefreshing ? "animate-spin" : ""
                }`}
              >
                <HiRefresh />
              </button>
            </div>
          )}

          {isLoggedIn && visibleLinks.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6 justify-items-center">
              {visibleLinks.map(({ title, shareId, expiryTime }, index) => (
                <div key={index} className="relative w-full">
                  <div className="flex justify-between items-center w-full gap-3">
                    <Link
                      to={`${baseUrl}/${shareId}`}
                      aria-label={title}
                      title={`${title}\n${
                        new Date(expiryTime).toLocaleString() || ""
                      }`}
                      className="ide-card ide-card-link w-full whitespace-nowrap overflow-hidden text-ellipsis"
                    >
                      {title
                        ? `${title.charAt(0).toUpperCase()}${
                            title.length > 30
                              ? title.slice(1, 30) + "..." + title.slice(-3)
                              : title.slice(1)
                          }`
                        : "Untitled"}
                    </Link>

                    <div className="flex flex-col items-center w-10 space-y-2">
                      <button
                        onClick={() => handleCopy(shareId)}
                        title="Copy link"
                        className="ide-icon-button w-full py-2 cursor-pointer focus:outline-none"
                      >
                        {buttonStates[shareId]?.text === "Copied" ? (
                          <MdDone className="mx-auto" />
                        ) : (
                          <FiClipboard className="mx-auto" />
                        )}
                      </button>

                      <button
                        onClick={() => handleDelete(shareId)}
                        title="Delete"
                        className="ide-icon-button ide-icon-button--danger w-full py-2 cursor-pointer focus:outline-none"
                      >
                        <CgTrash className="mx-auto" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isLoggedIn && sharedLinks.length > itemsPerPage && (
            <div className="flex justify-between mt-6">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="ide-primary-button px-6 py-2 cursor-pointer transform transition duration-200 ease-in-out flex items-center disabled:opacity-60"
              >
                <FiArrowLeft className="mr-2" />
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={currentPage * itemsPerPage >= sharedLinks.length}
                className="ide-primary-button px-6 py-2 cursor-pointer transform transition duration-200 ease-in-out flex items-center disabled:opacity-60"
              >
                Next
                <FiArrowRight className="ml-2" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SharedLinks;
