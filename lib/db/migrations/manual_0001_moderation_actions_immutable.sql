-- Run this after the initial drizzle-kit migration has created moderation_actions.
-- moderation_actions is an audit trail: once a row is written, it can never be
-- changed or removed, even by a superuser role, so history can't be quietly rewritten.
CREATE OR REPLACE FUNCTION prevent_moderation_actions_mutation()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'moderation_actions rows are immutable: % is not allowed', TG_OP;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS moderation_actions_no_update ON moderation_actions;
CREATE TRIGGER moderation_actions_no_update
  BEFORE UPDATE ON moderation_actions
  FOR EACH ROW EXECUTE FUNCTION prevent_moderation_actions_mutation();

DROP TRIGGER IF EXISTS moderation_actions_no_delete ON moderation_actions;
CREATE TRIGGER moderation_actions_no_delete
  BEFORE DELETE ON moderation_actions
  FOR EACH ROW EXECUTE FUNCTION prevent_moderation_actions_mutation();
