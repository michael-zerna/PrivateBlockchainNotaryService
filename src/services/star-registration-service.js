import { messageSignatureService } from "./message-signature-service";
import { blockchainService } from "./blockchain-service";
import { FORBIDDEN, STAR_NOT_VALID } from "../error";
import { Block } from "../model/block";

class StarService {

    async registerStar(request) {
        const response = await messageSignatureService.getValidMessageSignatureResponse(request.address);
        if (response) {
            if (this.starIsValid(request.star)) {
                request.star.story = this.convertStory(request.star.story, 'ascii', 'hex');
                return blockchainService.addBlock(new Block(request));
            } else {
                throw new Error(STAR_NOT_VALID);
            }
        } else {
            throw new Error(FORBIDDEN);
        }
    }

    starIsValid(star) {
        return star.dec && star.ra && this.hasValidStory(star.story);
    }

    hasValidStory(story) {
        return story && Buffer.byteLength(story, this.encoding) <= 500;
    }

    convertStory(story, from, to) {
        return Buffer.from(story, from).toString(to);
    }

    async getBlocksByAddress(address) {
        const result = [];
        const chain = await blockchainService.getChain();
        let itr = 0;
        while (itr < chain.length) {
            const block = chain[itr];
            if (block.body.address === address) {
                this.prepareStarForResponse(block);
                result.push(block);
            }
            itr++;
        }
        return result;
    }

    async getBlockByHash(hash) {
        const chain = await blockchainService.getChain();
        let itr = 0;
        while (itr < chain.length) {
            const block = chain[itr];
            if (block.hash === hash) {
                this.prepareStarForResponse(block);
                return block;
            }
            itr++;
        }
        return undefined;
    }

    async getBlockByHeight(height) {
        try {
            const block = await blockchainService.getBlock(height);
            if (block) {
                this.prepareStarForResponse(block);
            }
            return block;
        } catch(e) {
            return undefined;
        }


    }

    prepareStarForResponse(block) {
        const star = block.body.star;
        star.storyDecoded = this.convertStory(star.story, 'hex', 'ascii');
        delete star.story;
    }
}

export const starService = new StarService();