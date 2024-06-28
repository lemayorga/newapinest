import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ValidRoles } from '../models/role.enum';
import { RoleProtected } from './roles.decorator';
import { UerRoleGuard } from '../guards/uer-role.guard';

/**
 * Checks whether a route or a Controller is protected with the specified Guard.
 * @param roles roles codes arrays to specific
 * @returns true if it's valid user with role
 */
export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard(), UerRoleGuard),
  );
}