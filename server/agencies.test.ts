import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("agencies router", () => {
  it("list should return agencies", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const agencies = await caller.agencies.list();

    expect(Array.isArray(agencies)).toBe(true);
    expect(agencies.length).toBeGreaterThan(0);
    
    // Check first agency structure
    const firstAgency = agencies[0];
    expect(firstAgency).toHaveProperty("id");
    expect(firstAgency).toHaveProperty("name");
    expect(firstAgency).toHaveProperty("address");
    expect(firstAgency).toHaveProperty("latitude");
    expect(firstAgency).toHaveProperty("longitude");
    expect(firstAgency).toHaveProperty("region");
  });

  it("getById should return specific agency", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // First get all agencies to find an ID
    const agencies = await caller.agencies.list();
    expect(agencies.length).toBeGreaterThan(0);

    const agencyId = agencies[0]!.id;

    // Now get specific agency
    const agency = await caller.agencies.getById({ id: agencyId });

    expect(agency).not.toBeNull();
    expect(agency?.id).toBe(agencyId);
    expect(agency?.name).toBeDefined();
    expect(agency?.address).toBeDefined();
  });

  it("getById should return null for non-existent agency", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const agency = await caller.agencies.getById({ id: "non-existent-id" });

    expect(agency).toBeNull();
  });

  it("agencies should have required fields", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const agencies = await caller.agencies.list();

    agencies.forEach((agency) => {
      expect(agency.id).toBeDefined();
      expect(typeof agency.id).toBe("string");
      
      expect(agency.name).toBeDefined();
      expect(typeof agency.name).toBe("string");
      
      expect(agency.address).toBeDefined();
      expect(typeof agency.address).toBe("string");
      
      expect(agency.latitude).toBeDefined();
      expect(agency.longitude).toBeDefined();
      
      expect(agency.region).toBeDefined();
      expect(typeof agency.region).toBe("string");
    });
  });

  it("agencies should have valid coordinates", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const agencies = await caller.agencies.list();

    agencies.forEach((agency) => {
      const lat = parseFloat(agency.latitude.toString());
      const lng = parseFloat(agency.longitude.toString());
      
      // Leicester coordinates should be roughly around 52.6°N, 1.1°W
      expect(lat).toBeGreaterThan(52);
      expect(lat).toBeLessThan(53);
      expect(lng).toBeGreaterThan(-2);
      expect(lng).toBeLessThan(-1);
    });
  });
});
