import InstalledVersion from "../../src/components/InstalledVersion";
import VersionController from "../../src/controllers/VersionController";

describe("InstalledVersion.spec.tsx", () => {
  context("tests", () => {
    const version = new VersionController();

    version.name = "Test Version";
    version.path = "C:\\test\\path\\version";

    beforeEach(() => {
      cy.mount(
        <div className="w-full flex flex-col items-stretch p-4 gap-2">
          <InstalledVersion
            version={version}
            onUpdate={() => {}}
          />
        </div>
      );
    });

    it("Should have a name", () => {
      cy.get("[data-cy-version-name]").should("contain.text", version.name);
    });

    it("Should have a location", () => {
      cy.get("[data-cy-location]").should("contain.text", version.path);
    });
  });

  context("playground", () => {
    it("playground", () => {
      const version = new VersionController();

      version.name = "Test Version";
      version.path = "C:\\test\\path\\version";

      cy.mount(
        <div className="w-full flex flex-col items-stretch p-4 gap-2">
          <InstalledVersion
            version={version}
            onUpdate={() => {}}
          />
        </div>
      );
    });
  });
});
