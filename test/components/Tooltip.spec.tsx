import Tooltip from "../../src/components/Tooltip";

describe("Tooltip.spec.tsx", () => {
  it("playground", () => {
    cy.mount(
      <div className="size-full flex flex-col items-stretch overflow-y-auto">
        <div className="h-256 flex flex-col items-center p-16 shrink-0">
          <div className="grid grid-cols-3 gap-2">
            <Tooltip
              tooltip="Top Start"
              position="top"
              anchor="start"
              className="border flex items-center justify-center h-16"
            >
              <span>Top Start ---------------</span>
            </Tooltip>
            <Tooltip
              tooltip="Top Center"
              position="top"
              anchor="center"
              className="border flex items-center justify-center h-16"
            >
              <span>Top Center ---------------</span>
            </Tooltip>
            <Tooltip
              tooltip="Top End"
              position="top"
              anchor="end"
              className="border flex items-center justify-center h-16"
            >
              <span>Top End ---------------</span>
            </Tooltip>
            <Tooltip
              tooltip="Right Start"
              position="right"
              anchor="start"
              className="border flex items-center justify-center h-16"
            >
              <span>Right Start ---------------</span>
            </Tooltip>
            <Tooltip
              tooltip="Right Center"
              position="right"
              anchor="center"
              className="border flex items-center justify-center h-16"
            >
              <span>Right Center ---------------</span>
            </Tooltip>
            <Tooltip
              tooltip="Right End"
              position="right"
              anchor="end"
              className="border flex items-center justify-center h-16"
            >
              <span>Right End ---------------</span>
            </Tooltip>
            <Tooltip
              tooltip="Left Start"
              position="left"
              anchor="start"
              className="border flex items-center justify-center h-16"
            >
              <span>Left Start ---------------</span>
            </Tooltip>
            <Tooltip
              tooltip="Left Center"
              position="left"
              anchor="center"
              className="border flex items-center justify-center h-16"
            >
              <span>Left Center ---------------</span>
            </Tooltip>
            <Tooltip
              tooltip="Left End"
              position="left"
              anchor="end"
              className="border flex items-center justify-center h-16"
            >
              <span>Left End ---------------</span>
            </Tooltip>
            <Tooltip
              tooltip="Bottom Start"
              position="bottom"
              anchor="start"
              className="border flex items-center justify-center h-16"
            >
              <span>Bottom Start ---------------</span>
            </Tooltip>
            <Tooltip
              tooltip="Bottom Center"
              position="bottom"
              anchor="center"
              className="border flex items-center justify-center h-16"
            >
              <span>Bottom Center ---------------</span>
            </Tooltip>
            <Tooltip
              tooltip="Bottom End"
              position="bottom"
              anchor="end"
              className="border flex items-center justify-center h-16"
            >
              <span>Bottom End ---------------</span>
            </Tooltip>
          </div>
        </div>
      </div>
    );
  });
});
