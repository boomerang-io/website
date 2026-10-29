import { Link } from "react-router";
import * as React from "react";

export function VersionWarningMessage({
  branches,
  currentRef,
  latestPath,
  splat,
}: {
  branches: string[];
  currentRef: string;
  latestPath: string;
  splat?: string;
}) {
  // Don't want to show release-next in the menu, but we do want to show
  // the branch-warning
  let warning = [...branches].includes(currentRef)
    ? `Viewing docs for ${currentRef} branch, not the latest release`
    : `Viewing docs for an older release`;

  return (
    <>
      {warning}.{" "}
      <Link
        to={splat ? `${latestPath}/${splat}` : latestPath}
        className="underline"
      >
        View latest
      </Link>
    </>
  );
}
