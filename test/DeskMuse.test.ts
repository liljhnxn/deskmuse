import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;
import { DeskMuse } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("DeskMuse Smart Contract", function () {
  let deskMuse: DeskMuse;
  let owner: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
  let user2: HardhatEthersSigner;

  const sampleSetup = {
    title: "Minimalist Birch Workspace",
    description: "Solid oak desk, 34-inch ultrawide OLED, customized mechanical keyboard.",
    imageUrl: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd",
    category: "Minimalist",
    setupType: "Ultrawide Monitor",
  };

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    const DeskMuseFactory = await ethers.getContractFactory("DeskMuse");
    deskMuse = await DeskMuseFactory.deploy();
    await deskMuse.waitForDeployment();
  });

  describe("Initial State", function () {
    it("should initialize with 0 setups and 0 likes", async function () {
      expect(await deskMuse.totalSetups()).to.equal(0n);
      expect(await deskMuse.totalLikes()).to.equal(0n);
      const allSetups = await deskMuse.getAllSetups();
      expect(allSetups.length).to.equal(0);
    });
  });

  describe("Publishing Setups", function () {
    it("should successfully publish a setup and emit SetupPublished", async function () {
      const tx = await deskMuse.connect(user1).publishSetup(
        sampleSetup.title,
        sampleSetup.description,
        sampleSetup.imageUrl,
        sampleSetup.category,
        sampleSetup.setupType
      );

      await expect(tx)
        .to.emit(deskMuse, "SetupPublished")
        .withArgs(
          1n,
          user1.address,
          sampleSetup.title,
          sampleSetup.category,
          sampleSetup.setupType,
          (timestamp: any) => timestamp > 0
        );

      expect(await deskMuse.totalSetups()).to.equal(1n);

      const setup = await deskMuse.getSetup(1n);
      expect(setup.id).to.equal(1n);
      expect(setup.author).to.equal(user1.address);
      expect(setup.title).to.equal(sampleSetup.title);
      expect(setup.description).to.equal(sampleSetup.description);
      expect(setup.imageUrl).to.equal(sampleSetup.imageUrl);
      expect(setup.category).to.equal(sampleSetup.category);
      expect(setup.setupType).to.equal(sampleSetup.setupType);
      expect(setup.likesCount).to.equal(0n);
      expect(setup.exists).to.be.true;
    });

    it("should revert if title is empty", async function () {
      await expect(
        deskMuse.connect(user1).publishSetup(
          "",
          sampleSetup.description,
          sampleSetup.imageUrl,
          sampleSetup.category,
          sampleSetup.setupType
        )
      ).to.be.revertedWithCustomError(deskMuse, "EmptyTitle");
    });

    it("should revert if imageUrl is empty", async function () {
      await expect(
        deskMuse.connect(user1).publishSetup(
          sampleSetup.title,
          sampleSetup.description,
          "",
          sampleSetup.category,
          sampleSetup.setupType
        )
      ).to.be.revertedWithCustomError(deskMuse, "EmptyImageUrl");
    });

    it("should revert if category is empty", async function () {
      await expect(
        deskMuse.connect(user1).publishSetup(
          sampleSetup.title,
          sampleSetup.description,
          sampleSetup.imageUrl,
          "",
          sampleSetup.setupType
        )
      ).to.be.revertedWithCustomError(deskMuse, "EmptyCategory");
    });
  });

  describe("Liking and Unliking Setups", function () {
    beforeEach(async function () {
      await deskMuse.connect(user1).publishSetup(
        sampleSetup.title,
        sampleSetup.description,
        sampleSetup.imageUrl,
        sampleSetup.category,
        sampleSetup.setupType
      );
    });

    it("should allow a user to like a setup and track counts", async function () {
      const tx = await deskMuse.connect(user2).likeSetup(1n);

      await expect(tx)
        .to.emit(deskMuse, "SetupLiked")
        .withArgs(1n, user2.address, 1n, (timestamp: any) => timestamp > 0);

      expect(await deskMuse.totalLikes()).to.equal(1n);
      expect(await deskMuse.hasUserLiked(1n, user2.address)).to.be.true;

      const setup = await deskMuse.getSetup(1n);
      expect(setup.likesCount).to.equal(1n);

      const userLiked = await deskMuse.getUserLikedSetups(user2.address);
      expect(userLiked.length).to.equal(1);
      expect(userLiked[0]).to.equal(1n);
    });

    it("should prevent duplicate likes from the same wallet", async function () {
      await deskMuse.connect(user2).likeSetup(1n);

      await expect(
        deskMuse.connect(user2).likeSetup(1n)
      ).to.be.revertedWithCustomError(deskMuse, "AlreadyLiked");
    });

    it("should allow unlike and correctly update like count", async function () {
      await deskMuse.connect(user2).likeSetup(1n);
      expect(await deskMuse.totalLikes()).to.equal(1n);

      const tx = await deskMuse.connect(user2).unlikeSetup(1n);

      await expect(tx)
        .to.emit(deskMuse, "SetupUnliked")
        .withArgs(1n, user2.address, 0n, (timestamp: any) => timestamp > 0);

      expect(await deskMuse.totalLikes()).to.equal(0n);
      expect(await deskMuse.hasUserLiked(1n, user2.address)).to.be.false;

      const setup = await deskMuse.getSetup(1n);
      expect(setup.likesCount).to.equal(0n);
    });

    it("should revert when unliking a setup that was not liked", async function () {
      await expect(
        deskMuse.connect(user2).unlikeSetup(1n)
      ).to.be.revertedWithCustomError(deskMuse, "NotLiked");
    });
  });

  describe("Removing Setups", function () {
    beforeEach(async function () {
      await deskMuse.connect(user1).publishSetup(
        sampleSetup.title,
        sampleSetup.description,
        sampleSetup.imageUrl,
        sampleSetup.category,
        sampleSetup.setupType
      );
      await deskMuse.connect(user2).likeSetup(1n);
    });

    it("should allow only the author to remove the setup", async function () {
      await expect(
        deskMuse.connect(user2).removeSetup(1n)
      ).to.be.revertedWithCustomError(deskMuse, "NotSetupAuthor");
    });

    it("should remove setup and adjust totalSetups and totalLikes", async function () {
      expect(await deskMuse.totalSetups()).to.equal(1n);
      expect(await deskMuse.totalLikes()).to.equal(1n);

      const tx = await deskMuse.connect(user1).removeSetup(1n);

      await expect(tx)
        .to.emit(deskMuse, "SetupRemoved")
        .withArgs(1n, user1.address, (timestamp: any) => timestamp > 0);

      expect(await deskMuse.totalSetups()).to.equal(0n);
      expect(await deskMuse.totalLikes()).to.equal(0n);

      const allSetups = await deskMuse.getAllSetups();
      expect(allSetups.length).to.equal(0);

      await expect(deskMuse.getSetup(1n)).to.be.revertedWithCustomError(
        deskMuse,
        "SetupDoesNotExist"
      );
    });
  });

  describe("Multiple Setups & Retrieval", function () {
    it("should return all active setups correctly", async function () {
      await deskMuse.connect(user1).publishSetup(
        "Setup One",
        "Description 1",
        "https://example.com/1.jpg",
        "Gaming Setup",
        "Dual Monitor"
      );
      await deskMuse.connect(user2).publishSetup(
        "Setup Two",
        "Description 2",
        "https://example.com/2.jpg",
        "Study Setup",
        "Standing Desk"
      );

      const all = await deskMuse.getAllSetups();
      expect(all.length).to.equal(2);
      expect(all[0].title).to.equal("Setup One");
      expect(all[1].title).to.equal("Setup Two");

      // Remove setup 1
      await deskMuse.connect(user1).removeSetup(1n);
      const remaining = await deskMuse.getAllSetups();
      expect(remaining.length).to.equal(1);
      expect(remaining[0].title).to.equal("Setup Two");
    });
  });
});
