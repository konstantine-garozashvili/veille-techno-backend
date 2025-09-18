import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenBlacklistService {
  private blacklistedTokens = new Set<string>();

  /**
   * Add a token to the blacklist
   * @param token JWT token to blacklist
   */
  blacklistToken(token: string): void {
    this.blacklistedTokens.add(token);
  }

  /**
   * Check if a token is blacklisted
   * @param token JWT token to check
   * @returns true if token is blacklisted, false otherwise
   */
  isTokenBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }

  /**
   * Extract token from Authorization header
   * @param authHeader Authorization header value
   * @returns JWT token without 'Bearer ' prefix
   */
  extractTokenFromHeader(authHeader: string): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }

  /**
   * Clean expired tokens from blacklist
   * This method should be called periodically to prevent memory leaks
   * @param jwtService JWT service to decode tokens
   */
  cleanExpiredTokens(jwtService: JwtService): void {
    const now = Math.floor(Date.now() / 1000);
    
    for (const token of this.blacklistedTokens) {
      try {
        const decoded = jwtService.decode(token) as any;
        if (decoded && decoded.exp && decoded.exp < now) {
          this.blacklistedTokens.delete(token);
        }
      } catch (error) {
        // If token can't be decoded, remove it from blacklist
        this.blacklistedTokens.delete(token);
      }
    }
  }

  /**
   * Get the number of blacklisted tokens (for monitoring)
   * @returns number of tokens in blacklist
   */
  getBlacklistSize(): number {
    return this.blacklistedTokens.size;
  }

  /**
   * Clear all blacklisted tokens (for testing purposes)
   */
  clearBlacklist(): void {
    this.blacklistedTokens.clear();
  }
}