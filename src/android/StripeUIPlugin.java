package cordova.plugin.stripeuiplugin;

import android.content.Intent;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class StripeUIPlugin extends CordovaPlugin {
    private CallbackContext callback;

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) {
        switch (action) {
            case "presentPaymentSheet":
                this.presentPaymentSheet(args, callbackContext);
                break;
            default:
                return false;
        }
        return true;
    }

    private void presentPaymentSheet(JSONArray args, CallbackContext callbackContext) {
        cordova.getThreadPool().execute(() -> {
            try {
                callback = callbackContext;
                String publishableKey = args.getString(0);
                String companyName = args.getString(1);
                String appleMerchantId = args.getString(2);
                String paymentIntent = args.getString(3);
                String customer = args.getString(4);
                String ephemeralKey = args.getString(5);
                Intent intent = new Intent(cordova.getActivity().getApplicationContext(), CheckoutActivity.class);
                intent.putExtra("publishableKey", publishableKey);
                intent.putExtra("companyName", companyName);
                intent.putExtra("appleMerchantId", appleMerchantId);
                intent.putExtra("paymentIntent", paymentIntent);
                intent.putExtra("customer", customer);
                intent.putExtra("ephemeralKey", ephemeralKey);
                cordova.setActivityResultCallback(this);
                cordova.getActivity().startActivityForResult(intent, 1);
            } catch (Throwable e) {
                e.printStackTrace();
                callbackContext.error(e.getMessage());
            }
        });
    }

    private JSONObject mapToJSON(HashMap<String, String> map) {
        JSONObject message = new JSONObject();
        for (Map.Entry<String, String> pairs : map.entrySet()) {
            try {
                message.put(pairs.getKey(), pairs.getValue());
            } catch (JSONException ignored) {
            }
        }
        return message;
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
        super.onActivityResult(requestCode, resultCode, intent);
        if (requestCode == 1) {
            if (resultCode == -1) {
                HashMap<String, String> resultMap = (HashMap<String, String>) intent.getSerializableExtra("result");
                String data = resultMap != null ? mapToJSON(resultMap).toString() : "OK";
                callback.success(data);
            }
        }
    }

}
