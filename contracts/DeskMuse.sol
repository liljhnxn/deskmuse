// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title DeskMuse
 * @notice Decentralized workspace inspiration platform where users showcase desk setups,
 * computer workspaces, and creative environments.
 * @dev Tagline: "Show Your Setup. Inspire Others."
 */
contract DeskMuse {
    struct Setup {
        uint256 id;
        address author;
        string title;
        string description;
        string imageUrl;
        string category;
        string setupType;
        uint256 likesCount;
        uint256 createdAt;
        bool exists;
    }

    uint256 private _nextSetupId;
    uint256 public totalSetups;
    uint256 public totalLikes;

    // setupId => Setup
    mapping(uint256 => Setup) public setups;

    // setupId => userAddress => hasLiked
    mapping(uint256 => mapping(address => bool)) public hasLiked;

    // All setup IDs ever created
    uint256[] private _setupIds;

    // Events
    event SetupPublished(
        uint256 indexed setupId,
        address indexed author,
        string title,
        string category,
        string setupType,
        uint256 timestamp
    );

    event SetupLiked(
        uint256 indexed setupId,
        address indexed liker,
        uint256 newLikesCount,
        uint256 timestamp
    );

    event SetupUnliked(
        uint256 indexed setupId,
        address indexed unliker,
        uint256 newLikesCount,
        uint256 timestamp
    );

    event SetupRemoved(
        uint256 indexed setupId,
        address indexed author,
        uint256 timestamp
    );

    // Errors
    error EmptyTitle();
    error EmptyImageUrl();
    error EmptyCategory();
    error SetupDoesNotExist();
    error NotSetupAuthor();
    error AlreadyLiked();
    error NotLiked();

    constructor() {
        _nextSetupId = 1;
    }

    /**
     * @notice Publishes a new desk setup on-chain.
     * @param title Title of the setup (required)
     * @param description Brief description or gear breakdown
     * @param imageUrl Direct preview URL of setup photo (required)
     * @param category Main category e.g. Gaming Setup, Minimalist, etc. (required)
     * @param setupType Optional setup type e.g. Dual Monitor, Standing Desk, Ultrawide
     * @return setupId Unique ID of the published setup
     */
    function publishSetup(
        string calldata title,
        string calldata description,
        string calldata imageUrl,
        string calldata category,
        string calldata setupType
    ) external returns (uint256 setupId) {
        if (bytes(title).length == 0) revert EmptyTitle();
        if (bytes(imageUrl).length == 0) revert EmptyImageUrl();
        if (bytes(category).length == 0) revert EmptyCategory();

        setupId = _nextSetupId++;

        setups[setupId] = Setup({
            id: setupId,
            author: msg.sender,
            title: title,
            description: description,
            imageUrl: imageUrl,
            category: category,
            setupType: setupType,
            likesCount: 0,
            createdAt: block.timestamp,
            exists: true
        });

        _setupIds.push(setupId);
        totalSetups++;

        emit SetupPublished(
            setupId,
            msg.sender,
            title,
            category,
            setupType,
            block.timestamp
        );
    }

    /**
     * @notice Removes a setup. Only the original author can remove their setup.
     * @param setupId ID of the setup to remove
     */
    function removeSetup(uint256 setupId) external {
        Setup storage setup = setups[setupId];
        if (!setup.exists) revert SetupDoesNotExist();
        if (setup.author != msg.sender) revert NotSetupAuthor();

        if (totalLikes >= setup.likesCount) {
            totalLikes -= setup.likesCount;
        } else {
            totalLikes = 0;
        }

        setup.exists = false;
        totalSetups--;

        emit SetupRemoved(setupId, msg.sender, block.timestamp);
    }

    /**
     * @notice Adds a like to an active setup. Prevents duplicate likes from the same wallet.
     * @param setupId ID of the setup to like
     */
    function likeSetup(uint256 setupId) external {
        Setup storage setup = setups[setupId];
        if (!setup.exists) revert SetupDoesNotExist();
        if (hasLiked[setupId][msg.sender]) revert AlreadyLiked();

        hasLiked[setupId][msg.sender] = true;
        setup.likesCount++;
        totalLikes++;

        emit SetupLiked(setupId, msg.sender, setup.likesCount, block.timestamp);
    }

    /**
     * @notice Removes a like previously placed by the caller.
     * @param setupId ID of the setup to unlike
     */
    function unlikeSetup(uint256 setupId) external {
        Setup storage setup = setups[setupId];
        if (!setup.exists) revert SetupDoesNotExist();
        if (!hasLiked[setupId][msg.sender]) revert NotLiked();

        hasLiked[setupId][msg.sender] = false;
        setup.likesCount--;
        if (totalLikes > 0) {
            totalLikes--;
        }

        emit SetupUnliked(setupId, msg.sender, setup.likesCount, block.timestamp);
    }

    /**
     * @notice Returns all currently active published setups.
     * @return activeSetups Array of active Setup structs
     */
    function getAllSetups() external view returns (Setup[] memory) {
        uint256 activeCount = totalSetups;
        Setup[] memory activeSetups = new Setup[](activeCount);
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < _setupIds.length && currentIndex < activeCount; i++) {
            uint256 id = _setupIds[i];
            if (setups[id].exists) {
                activeSetups[currentIndex] = setups[id];
                currentIndex++;
            }
        }

        return activeSetups;
    }

    /**
     * @notice Fetches a single setup by ID.
     * @param setupId The ID of the setup
     */
    function getSetup(uint256 setupId) external view returns (Setup memory) {
        Setup memory setup = setups[setupId];
        if (!setup.exists) revert SetupDoesNotExist();
        return setup;
    }

    /**
     * @notice Checks if a user has liked a specific setup.
     * @param setupId The ID of the setup
     * @param user The address to check
     */
    function hasUserLiked(uint256 setupId, address user) external view returns (bool) {
        return hasLiked[setupId][user];
    }

    /**
     * @notice Returns all active setup IDs liked by a given user.
     * @param user The address of the user
     */
    function getUserLikedSetups(address user) external view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < _setupIds.length; i++) {
            uint256 id = _setupIds[i];
            if (setups[id].exists && hasLiked[id][user]) {
                count++;
            }
        }

        uint256[] memory likedIds = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < _setupIds.length && index < count; i++) {
            uint256 id = _setupIds[i];
            if (setups[id].exists && hasLiked[id][user]) {
                likedIds[index] = id;
                index++;
            }
        }
        return likedIds;
    }
}

